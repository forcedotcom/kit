/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Converts value to a boolean.
 *
 * @param value The value to convert
 * @returns boolean
 */
export function toBoolean(value: unknown): boolean {
  switch (typeof value) {
    case 'boolean':
      return value;
    case 'string':
      return value.toLowerCase() === 'true' || value === '1';
    default:
      return false;
  }
}
