/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { expect } from 'chai';
import { ensureArray } from '../src/collections';

describe('collections', () => {
  describe('ensureArray', () => {
    it('undefined => empty array', () => {
      const input = undefined;
      expect(ensureArray(input)).to.deep.equal([]);
    });
    it('an array => the array', () => {
      const input = ['a', 'b'];
      expect(ensureArray(input)).to.deep.equal(input);
    });
    it('a single item => obj in an array', () => {
      const input = 'a';
      expect(ensureArray(input)).to.deep.equal([input]);
    });
  });
});
