/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
export type SettledResult<T, E = Error> = {
  fulfilled: T[];
  rejected: E[];
};

export async function settleAll<T, E = Error>(promises: Array<Promise<T>>): Promise<SettledResult<T, E>> {
  const settled: SettledResult<T, E> = {
    fulfilled: [],
    rejected: [],
  };

  const allSettled = await Promise.allSettled(promises);
  settled.fulfilled = allSettled
    .filter((s) => s.status === 'fulfilled')
    .map((s) => {
      if (s.status === 'fulfilled') {
        return s.value as T;
      } else {
        return undefined;
      }
    })
    .filter((v) => v !== undefined) as T[];

  settled.rejected = allSettled
    .filter((s) => s.status === 'rejected')
    .map((s) => {
      if (s.status === 'rejected') {
        return s.reason as E;
      } else {
        return undefined;
      }
    })
    .filter((v) => v !== undefined) as E[];

  return settled;
}
