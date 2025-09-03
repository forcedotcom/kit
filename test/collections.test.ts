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
import { ensureArray } from '../src/collections';

describe('collections', () => {
  describe('ensureArray', () => {
    it('undefined => empty array', () => {
      expect(ensureArray(undefined)).to.deep.equal([]);
    });
    it('null => empty array', () => {
      expect(ensureArray(null)).to.deep.equal([]);
    });
    it('zero => array with zero', () => {
      expect(ensureArray(0)).to.deep.equal([0]);
    });
    it('empty array => empty array', () => {
      expect(ensureArray([])).to.deep.equal([]);
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
