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
