/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { versions } from 'node:process';
import { expect } from 'chai';
import { JsonParseError, NamedError } from '../src/errors';

describe('NamedError', () => {
  it('should concatenate cause stacks into a fullStack property', () => {
    const zero = new Error('message zero');
    zero.stack = `${zero.name}: ${zero.message}\n    at test:0:1`;
    const one = new NamedError('OneError', zero);
    one.stack = `${one.name}:\n    at test:1:1`;
    const two = new NamedError('TwoError', 'message two', one);
    two.stack = `${two.name}: ${two.message}\n    at test:2:1`;
    const three = new NamedError('ThreeError', two);
    three.stack = `${three.name}:\n    at test:3:1`;

    [
      'NamedError [ThreeError]',
      'at test:3:1',
      'cause: NamedError [TwoError]: message two',
      'at test:2:1',
      'cause: NamedError [OneError]',
      'at test:1:1',
      'cause: Error: message zero',
      'at test:0:1',
    ].map((line) => expect(three.fullStack).to.contain(line));
  });
});

describe('JsonParseError', () => {
  it('should create with error parsing {blah}', () => {
    const data = '{blah}';
    try {
      JSON.parse(data);
      expect.fail(null, null, 'Should be unreachable');
    } catch (err) {
      const jsonErr = JsonParseError.create(err as SyntaxError, data, 'fake.json');
      expect(jsonErr.cause).to.equal(err);
      expect(jsonErr.name).to.equal('JsonParseError');
      expect(jsonErr.path).to.equal('fake.json');
      expect(jsonErr.line).to.equal(1);
      expect(jsonErr.errorPortion).to.equal('{blah}');
      expect(jsonErr.message).to.equal('Parse error in file fake.json on line 1\n{blah}');
    }
  });

  it('should create with error parsing {', () => {
    const nodeVersion = parseInt(versions.node.split('.')[0], 10);
    const data = '{';
    try {
      JSON.parse(data);
      expect.fail(null, null, 'Should be unreachable');
    } catch (err) {
      const jsonErr = JsonParseError.create(err as SyntaxError, data, 'fake.json');
      expect(jsonErr.cause).to.equal(err);
      expect(jsonErr.name).to.equal('JsonParseError');
      expect(jsonErr.path).to.equal('fake.json');

      if (nodeVersion >= 20) {
        expect(jsonErr.line).to.equal(1);
        expect(jsonErr.errorPortion).to.equal(data);
        expect(jsonErr.message).to.contain('Parse error in file fake.json on line 1');
        expect(jsonErr.message).to.contain(data);
      } else {
        expect(jsonErr.line).to.be.undefined;
        expect(jsonErr.errorPortion).to.be.undefined;

        expect(jsonErr.message).to.equal('Unexpected end of JSON input');
      }
    }
  });
});
