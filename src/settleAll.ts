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

/** narrow promise.allSettled results to the successes, with provided type */
export const isFulfilled = <T>(s: PromiseSettledResult<T>): s is PromiseFulfilledResult<T> => s.status === 'fulfilled';

/** narrow promise.allSettled results to the faiures.  Result is untyped */
export const isRejected = (s: PromiseSettledResult<unknown>): s is PromiseRejectedResult => s.status === 'rejected';

/**
 * Wrapper for promise.allSettled that returns typed errors
 *
 * @param promises Array of promises to settle
 *
 * @example
 * ```
 * const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
 * const { fulfilled, rejected } = await settleAll<number, SfError>(promises);
 * ```
 */
export async function settleAll<T, E = Error>(promises: Array<Promise<T>>): Promise<SettledResult<T, E>> {
  const allSettled = await Promise.allSettled(promises);
  return {
    fulfilled: allSettled.filter(isFulfilled).map((s): T => s.value),
    rejected: allSettled.filter(isRejected).map((s): E => s.reason as E),
  };
}
