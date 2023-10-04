/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { spy } from 'sinon';

import {
  defaults,
  findKey,
  includes,
  keyBy,
  mapKeys,
  maxBy,
  merge,
  minBy,
  omit,
  once,
  set,
  sortBy,
  toNumber,
} from '../../src/nodash/external';

describe('nodash', () => {
  describe('defaults', () => {
    it('should assign defaults', () => {
      const result = defaults({ a: 1 }, { b: 2 }, { a: 3 });
      expect(result).to.deep.equal({ a: 1, b: 2 });
    });
  });

  describe('findKey', () => {
    it('should find keys in various ways', () => {
      const users = {
        barney: { age: 36, active: true },
        fred: { age: 40, active: false },
        pebbles: { age: 1, active: true },
      };

      let result = findKey(users, (o) => o.age < 40);
      expect(result).to.equal('barney');

      result = findKey(users, { age: 1, active: true });
      expect(result).to.equal('pebbles');

      result = findKey(users, ['active', false]);
      expect(result).to.equal('fred');

      result = findKey(users, 'active');
      expect(result).to.equal('barney');
    });
  });

  describe('includes', () => {
    it('should ', () => {
      expect(includes([1, 2, 3], 1)).to.be.true;
      expect(includes([1, 2, 3], 1, 2)).to.be.false;
      expect(includes({ a: 1, b: 2 }, 1)).to.be.true;
      expect(includes('abcd', 'bc')).to.be.true;
    });
  });

  describe('keyBy', () => {
    it('should generate an object from keys of an array of objects', () => {
      const array = [
        { dir: 'left', code: 97 },
        { dir: 'right', code: 100 },
      ];
      const result = keyBy(array, (o) => String.fromCharCode(o.code));
      expect(result).to.deep.equal({
        a: { dir: 'left', code: 97 },
        d: { dir: 'right', code: 100 },
      });
    });
  });

  describe('mapKeys', () => {
    it('should map the keys of an object', () => {
      const obj = { a: 1, b: 2 };
      const result = mapKeys(obj, (value, key) => `${key}${value}`);
      expect(result).to.deep.equal({ a1: 1, b2: 2 });
    });
  });

  describe('minBy', () => {
    it('should find objects by min values in various ways', () => {
      const objects = [{ n: 1 }, { n: 2 }];

      let result = minBy(objects, (o) => o.n);
      expect(result).to.deep.equal({ n: 1 });

      result = minBy(objects, 'n');
      expect(result).to.deep.equal({ n: 1 });
    });
  });

  describe('maxBy', () => {
    it('should find objects by max values in various ways', () => {
      const objects = [{ n: 1 }, { n: 2 }];

      let result = maxBy(objects, (o) => o.n);
      expect(result).to.deep.equal({ n: 2 });

      result = maxBy(objects, 'n');
      expect(result).to.deep.equal({ n: 2 });
    });
  });

  describe('merge', () => {
    it('should recursively merge objects', () => {
      const users = {
        data: [{ user: 'barney' }, { user: 'fred' }],
      };

      const ages = {
        data: [{ age: 36 }, { age: 40 }],
      };

      const result = merge(users, ages);
      expect(result).to.deep.equal({
        data: [
          { user: 'barney', age: 36 },
          { user: 'fred', age: 40 },
        ],
      });
    });
  });

  describe('omit', () => {
    it('should omit properties of an object', () => {
      const object = { a: 1, b: 2, c: 3 };

      const result = omit(object, ['a', 'c']);
      expect(result).to.deep.equal({ b: 2 });
    });
  });

  describe('once', () => {
    it('should ', () => {
      const doInit = spy();
      const initialize = once(doInit);
      initialize();
      initialize();
      expect(doInit.calledOnce).to.be.true;
    });
  });

  describe('set', () => {
    it('should set values on an object in various ways', () => {
      const obj = { a: [{ b: { c: 3 } }] };

      const result1 = set(obj, 'a[0].b.c', 4);
      expect(result1).to.deep.equal({ a: [{ b: { c: 4 } }] });

      type NewType = typeof obj & { x: [{ y: { z: number } }] };
      const result2 = set<NewType>(obj, 'x[0].y.z', 5);
      expect(result2).to.deep.equal({
        a: [{ b: { c: 4 } }],
        x: [{ y: { z: 5 } }],
      });
    });
  });

  describe('sortBy', () => {
    it('should sort an objects keys and values in various ways', () => {
      const users = [
        { user: 'fred', age: 48 },
        { user: 'barney', age: 36 },
        { user: 'fred', age: 42 },
        { user: 'barney', age: 34 },
      ];

      let result = sortBy(users, (o) => o.user);
      expect(result).to.deep.equal([
        { user: 'barney', age: 36 },
        { user: 'barney', age: 34 },
        { user: 'fred', age: 48 },
        { user: 'fred', age: 42 },
      ]);

      result = sortBy(users, ['user', 'age']);
      expect(result).to.deep.equal([
        { user: 'barney', age: 34 },
        { user: 'barney', age: 36 },
        { user: 'fred', age: 42 },
        { user: 'fred', age: 48 },
      ]);

      result = sortBy(users, 'user', (o) => Math.floor(o.age / 10));
      expect(result).to.deep.equal([
        { user: 'barney', age: 36 },
        { user: 'barney', age: 34 },
        { user: 'fred', age: 48 },
        { user: 'fred', age: 42 },
      ]);
    });
  });

  describe('toNumber', () => {
    it('should handle numbers', () => {
      expect(toNumber(3)).to.equal(3);
    });

    it('should handle number constants', () => {
      expect(toNumber(Number.MIN_VALUE)).to.equal(Number.MIN_VALUE);
    });

    it('should parse infinity', () => {
      expect(toNumber('Infinity')).to.equal(Infinity);
    });

    it('should parse integers', () => {
      expect(toNumber('3')).to.equal(3);
    });

    it('should parse floats', () => {
      expect(toNumber('3.2')).to.equal(3.2);
    });
  });
});
