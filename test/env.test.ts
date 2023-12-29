/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { Env } from '../src/env';

describe('Env', () => {
  let env: Env;

  beforeEach(() => {
    env = new Env({
      FOO: 'BAR',
      BOOL: 'true',
      BOOL2: '1',
      SET: 'a',
      SET2: 'c',
      SET3: 'b',
      LIST: 'a,b,c',
      ENUM: 'test',
      NONE: undefined,
    });
  });

  it('should get a string envar', () => {
    expect(env.getString('FOO')).to.equal('BAR');
  });

  it('should get a default string when asked for a non-existent string envar', () => {
    expect(env.getString('FOO2', 'BAR')).to.equal('BAR');
  });

  it('should set a string envar', () => {
    env.setString('FOO2', 'BAR2');
    expect(env.getString('FOO2')).to.equal('BAR2');
  });

  it('should delete a string envar explicitly', () => {
    env.unset('FOO');
    expect(env.getString('FOO')).to.be.undefined;
  });

  it('should delete a string envar implicitly', () => {
    env.setString('FOO', undefined);
    expect(env.getString('FOO')).to.be.undefined;
  });

  it('should get a boolean envar set to true', () => {
    expect(env.getString('BOOL')).to.equal('true');
    expect(env.getBoolean('BOOL')).to.be.true;
  });

  it('should get a boolean envar set to 1', () => {
    expect(env.getString('BOOL2')).to.equal('1');
    expect(env.getBoolean('BOOL2')).to.be.true;
  });

  it('should get a default boolean when asked for a non-existent boolean envar', () => {
    expect(env.getString('BOOL3', 'true')).to.equal('true');
    expect(env.getBoolean('BOOL3', true)).to.be.true;
  });

  it('should set a boolean envar', () => {
    env.setBoolean('BOOL3', true);
    expect(env.getString('BOOL3')).to.equal('true');
    expect(env.getBoolean('BOOL3')).to.be.true;
  });

  it('should delete a boolean envar', () => {
    env.unset('BOOL');
    expect(env.getString('BOOL')).to.be.undefined;
    expect(env.getBoolean('BOOL')).to.be.false;
  });

  it('should delete a boolean envar implicitly', () => {
    env.setBoolean('BOOL', undefined);
    expect(env.getString('BOOL')).to.be.undefined;
    expect(env.getBoolean('BOOL')).to.be.false;
  });

  it('should get a number envar set to 0', () => {
    env.setNumber('NUM', 0);
    expect(env.getString('NUM')).to.equal('0');
    expect(env.getNumber('NUM')).to.equal(0);
    expect(env.getBoolean('NUM')).to.be.false;
  });

  it('should get a number envar set to positive', () => {
    env.setNumber('NUM2', 1);
    expect(env.getString('NUM2')).to.equal('1');
    expect(env.getNumber('NUM2')).to.equal(1);
    expect(env.getBoolean('NUM2')).to.be.true;
  });

  it('should set a number envar to float', () => {
    env.setNumber('NUM3', 1.123);
    expect(env.getString('NUM3')).to.equal('1.123');
    expect(env.getNumber('NUM3')).to.equal(1.123);
  });

  it('should not get a number that is not set', () => {
    expect(env.getNumber('NUM4')).to.be.undefined;
  });

  it('should get a default number when asked for a non-existent boolean envar', () => {
    expect(env.getNumber('NUM5', 0)).to.equal(0);
  });

  it('should get NaN for invalid numbers', () => {
    env.setString('NUM6', 'invalid');
    // casing because we know it's the string 'invalid'
    expect(isNaN(env.getNumber('NUM6') as number)).to.be.true;
  });

  it('should get default number for NaN values', () => {
    env.setString('NUM6', 'invalid');
    expect(env.getNumber('NUM6', 0)).to.equal(0);
  });

  it('should delete a number envar', () => {
    env.unset('NUM');
    expect(env.getString('NUM')).to.be.undefined;
    expect(env.getNumber('NUM')).to.be.undefined;
  });

  it('should delete a number envar implicitly', () => {
    env.setNumber('NUM', undefined);
    expect(env.getString('NUM')).to.be.undefined;
    expect(env.getNumber('NUM')).to.be.undefined;
  });

  it('should easily enumerate all defined entries', () => {
    expect(env.entries()).to.deep.equal([
      ['FOO', 'BAR'],
      ['BOOL', 'true'],
      ['BOOL2', '1'],
      ['SET', 'a'],
      ['SET2', 'c'],
      ['SET3', 'b'],
      ['LIST', 'a,b,c'],
      ['ENUM', 'test'],
    ]);
  });
});
