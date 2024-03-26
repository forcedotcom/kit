/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * A wrapper for console.log that returns the input value unmodified
 *
 * ``` ts
 * // peek inside a chain of map functions
 * [1,2,3,4,5].map(logFn).map(yourNextFunction)
 *
 * // wrap a returned function call to see what it returns
 * return logFn(otherFunction())
 * ```
 */
export const logFn = <T>(x: T): T => {
  // eslint-disable-next-line no-console
  console.log(typeof x === 'object' ? JSON.stringify(x, null, 2) : x);
  return x;
};
