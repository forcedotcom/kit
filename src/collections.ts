/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Normalize an object to be an array if it isn't one.
 *
 * @param entryOrArray - An object that could be an array of its type or just its type
 * @returns An array of the input element (which might be empty)
 */

export const ensureArray = <T>(entryOrArray: T | T[] | undefined): T[] => {
  if (entryOrArray !== undefined && entryOrArray !== null) {
    return Array.isArray(entryOrArray) ? entryOrArray : [entryOrArray];
  }
  return [];
};
