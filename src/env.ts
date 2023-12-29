/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { definiteEntriesOf, Dictionary, KeyValue, Nullable, Optional } from '@salesforce/ts-types';
import { toBoolean } from './shared/functions';

/**
 * An injectable abstraction on top of `process.env` with various convenience functions
 * for accessing environment variables of different anticipated shapes.
 */
export class Env {
  public constructor(private store: Dictionary<string> = process?.env ?? {}) {
    this.store = store;
  }

  /**
   * Gets a `string` value for a given key.
   *
   * @param key The name of the envar.
   */
  public getString(key: string): Optional<string>;
  /**
   * Gets a `string` value for a given key.
   *
   * @param key The name of the envar.
   * @param def A default value.
   */
  public getString(key: string, def: string): string;
  // underlying method
  public getString(key: string, def?: string): Optional<string> {
    return this.store[key] ?? def;
  }

  /**
   * Sets a `string` value for a given key, or removes the current value when no value is given.
   *
   * @param key The name of the envar.
   * @param value The value to set.
   */
  public setString(key: string, value: Nullable<string>): void {
    if (value == null) {
      this.unset(key);
      return;
    }
    this.store[key] = value;
  }

  /**
   * Gets a `boolean` value for a given key. Returns the default value if no value was found.
   *
   * @param key The name of the envar.
   * @param def A default boolean, which itself defaults to `false` if not otherwise supplied.
   */
  public getBoolean(key: string, def = false): boolean {
    const value = this.getString(key, def.toString());
    return toBoolean(value);
  }

  /**
   * Sets a `boolean` value for a given key, or removes the current value when no value is given.
   *
   * @param key The name of the envar.
   * @param value The value to set.
   */
  public setBoolean(key: string, value: Nullable<boolean>): void {
    if (value == null) {
      this.unset(key);
      return;
    }
    this.setString(key, value.toString());
  }

  /**
   * Gets a `number` value for a given key. Returns the default value if no value was found.
   *
   * @param key The name of the envar.
   * @param def A default number, which itself defaults to `undefined` if not otherwise supplied.
   */
  public getNumber(key: string, def: number): number;
  public getNumber(key: string, def?: undefined): Optional<number>;
  public getNumber(key: string, def?: number | undefined): Optional<number> {
    const value = this.getString(key);
    if (value) {
      const num = Number(value);
      return isNaN(num) && typeof def === 'number' ? def : num;
    }
    return typeof def === 'number' ? def : undefined;
  }

  /**
   * Sets a `number` value for a given key, or removes the current value when no value is given.
   *
   * @param key The name of the envar.
   * @param value The value to set.
   */
  public setNumber(key: string, value: Nullable<number>): void {
    if (value == null) {
      this.unset(key);
      return;
    }
    this.setString(key, typeof value === 'number' ? String(value) : value);
  }

  /**
   * Unsets a value for a given key.
   *
   * @param key The name of the envar.
   */
  public unset(key: string): void {
    delete this.store[key];
  }

  /**
   * Gets an array of all definitely assigned key-value pairs from the underlying envar store.
   */
  public entries(): Array<KeyValue<string>> {
    return definiteEntriesOf(this.store);
  }
}

/**
 * The default `Env` instance, which wraps `process.env`.
 */
export const env = new Env();
