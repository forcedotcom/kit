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

import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { expect } from 'chai';
import { JsonDataFormatError, JsonParseError, JsonStringifyError } from '../src/errors';
import * as json from '../src/json';

describe('json', () => {
  describe('parseJson', () => {
    it('parses a valid json map', () => {
      const o = { a: 'a', b: ['b'] };
      const j = json.parseJson(JSON.stringify(o));
      expect(o).to.deep.equal(j);
    });

    it('parses a valid json array', () => {
      const a = [{}, {}];
      const j = json.parseJson(JSON.stringify(a));
      expect(a).to.deep.equal(j);
    });

    it('fails to parse invalid json', () => {
      expect(() => json.parseJson('{')).to.throw(JsonParseError);
    });

    it('fails to parse invalid json', () => {
      expect(() => json.parseJson('{')).to.throw(JsonParseError);
    });

    it('will parse invalid json as an empty obj if throwOnEmpty is false', () => {
      expect(() => json.parseJson('{', '/path', false)).to.throw(JsonParseError);
    });
  });

  describe('parseJsonMap', () => {
    it('parses a valid json map', () => {
      const o = { a: 'a', b: ['b'] };
      const j = json.parseJsonMap(JSON.stringify(o));
      expect(o).to.deep.equal(j);
    });

    it('fails to parse invalid json', () => {
      expect(() => json.parseJsonMap('{')).to.throw(JsonParseError);
    });

    it('fails to parse a valid json array', () => {
      expect(() => json.parseJsonMap('[{},{}]')).to.throw(JsonDataFormatError);
    });
  });

  describe('cloneJson', () => {
    it('clones a valid json map', () => {
      const o = { a: 'a', b: ['b'] };
      const clone = json.cloneJson(o);
      expect(clone).to.deep.equal(o);
      expect(clone).to.not.equal(o);
    });

    it('clones a valid json array', () => {
      const a = [{ a: 'a', b: ['b'] }, ['c', 1, true]];
      const clone = json.cloneJson(a);
      expect(clone).to.deep.equal(a);
      expect(clone).to.not.equal(a);
    });

    it('fails to clone an object with circular references', () => {
      const o: Dictionary = {};
      o.o = o;
      expect(() => json.cloneJson(o)).to.throw(JsonStringifyError);
    });
  });

  describe('getJsonValuesByName', () => {
    it('returns a flattened array of all elements of a given name found in a JSON tree', () => {
      const data: JsonMap = {
        a: 'fail',
        b: 'root',
        c: 'fail',
        d: {
          a: 'fail',
          b: 'd',
          c: 'fail',
        },
        e: [
          'fail',
          {
            a: 'fail',
            b: 'e',
            c: 'fail',
          },
          'fail',
        ],
      };
      expect(json.getJsonValuesByName(data, 'b')).to.deep.equal(['root', 'd', 'e']);
    });
  });

  describe('jsonIncludes', () => {
    it('should not find a value in an undefined container', () => {
      expect(json.jsonIncludes(undefined, undefined)).to.be.false;
    });

    it('should not find a value in a null container', () => {
      expect(json.jsonIncludes(null, null)).to.be.false;
    });

    it('should not find a value in a numeric container', () => {
      expect(json.jsonIncludes(1, 1)).to.be.false;
    });

    it('should not find a value in a boolean container', () => {
      expect(json.jsonIncludes(true, true)).to.be.false;
    });

    it('should find a value in in a JsonMap', () => {
      expect(json.jsonIncludes({ a: 1 }, 1)).to.be.true;
    });

    it('should find a value in in a JsonArray', () => {
      expect(json.jsonIncludes([1], 1)).to.be.true;
    });

    it('should find a string in a string', () => {
      expect(json.jsonIncludes('abcd', 'bc')).to.be.true;
    });

    it('should not find a non-string value in a string', () => {
      expect(json.jsonIncludes('123', 2)).to.be.false;
    });
  });
});
