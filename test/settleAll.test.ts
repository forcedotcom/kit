/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { expect } from 'chai';
import { settleAll } from '../src';

describe('settleAll', () => {
  it('should fulfill all promises', async () => {
    const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const settled = await settleAll(promises);
    expect(settled.fulfilled).to.deep.equal([1, 2, 3]);
    expect(settled.rejected).to.deep.equal([]);
  });
  it('should reject all promises', async () => {
    const promises = [Promise.reject(1), Promise.reject(2), Promise.reject(3)];
    const settled = await settleAll(promises);
    expect(settled.fulfilled).to.deep.equal([]);
    expect(settled.rejected).to.deep.equal([1, 2, 3]);
  });
  it('should fulfill and reject promises', async () => {
    const promises = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
    const settled = await settleAll(promises);
    expect(settled.fulfilled).to.deep.equal([1, 3]);
    expect(settled.rejected).to.deep.equal([2]);
  });
  it('should handle empty array', async () => {
    const promises: Array<Promise<never>> = [];
    const settled = await settleAll(promises);
    expect(settled.fulfilled).to.deep.equal([]);
    expect(settled.rejected).to.deep.equal([]);
  });
  // types other than primitives
  it('should handle types other than primitives', async () => {
    const promises = [Promise.resolve({ a: 1 }), Promise.resolve({ b: 2 }), Promise.resolve({ c: 3 })];
    const settled = await settleAll<Record<string, number>>(promises);
    expect(settled.fulfilled).to.deep.equal([{ a: 1 }, { b: 2 }, { c: 3 }]);
    expect(settled.rejected).to.deep.equal([]);
  });
  it('should handle types other than primitives and reject', async () => {
    const promises = [Promise.resolve({ a: 1 }), Promise.reject(new Error('boo')), Promise.resolve({ c: 3 })];
    const settled = await settleAll<Record<string, number>>(promises);
    expect(settled.fulfilled).to.deep.equal([{ a: 1 }, { c: 3 }]);
    expect(settled.rejected[0].message).to.deep.equal('boo');
  });
});
