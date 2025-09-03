/*
 * Copyright 2025, Salesforce, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
