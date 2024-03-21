/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export const logFn = <T>(x: T): T => {
  // eslint-disable-next-line no-console
  console.log(typeof x === 'string' ? x : JSON.stringify(x, null, 2));
  return x;
};
