/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ensureArray } from './collections';
import { Duration } from './duration';

export type PromiseOptions = {
  concurrency: number;
  stopOnError?: boolean;
  timeout?: Duration;
};

export type PromiseItem<T, O = T | undefined> = {
  source: T;
  producer: (source: T, throttledPromise: ThrottledPromiseAll<T, O | undefined>) => Promise<O | undefined>;
};

/**
 * A promise that throttles the number of promises running at a time.
 *
 * The constructor takes {@link PromiseOptions} to initialize the constraints of the promise.
 *
 * ```typescript
 * // Create a ThrottledPromiseAll that will take numbers and return numbers
 * const throttledPromise = new ThrottledPromiseAll<number, number>({ concurrency: 1, timeout: Duration.milliseconds(100) });
 *
 * // Define a producer function that will take a number and return a promise that resolves to a number
 * const numberProducer = (source: number, throttledPromiseAll: ThrottledPromiseAll<number, number | undefined>): Promise<number> => Promise.resolve(source + 1);
 * throttledPromiseAll.add([1, 2, 3, 4, 5], numberProducer);
 *
 * const numberResults = await throttledPromiseAll.all();
 * ```
 */
export class ThrottledPromiseAll<T, O = T> {
  readonly #results: Array<O | undefined> = [];
  private readonly queue: Array<PromiseItem<T, O | undefined>>;
  private readonly concurrency: number;
  private wait: Duration;
  private timeout: NodeJS.Timeout | undefined;

  /**
   * Construct a new ThrottledPromiseAll.
   *
   * @param options {@link PromiseOptions}
   */
  public constructor(options: PromiseOptions = { concurrency: 1 }) {
    this.queue = [];
    this.concurrency = options.concurrency;
    this.wait = options.timeout ?? Duration.milliseconds(0);
  }

  /**
   * Returns the results of the promises that have been resolved.
   */
  public get results(): Array<O | undefined> {
    return this.#results;
  }

  /**
   * Add source items to the queue of promises to be resolved.
   * Adding an item to the queue requires a producer function that will take the source item and return a promise.
   * Each item in the can have a different producer function, as long as the producer function conforms the
   * types of the ThrottledPromiseAll when constructed.
   *
   * @param source
   * @param producer the producer function that will take the source item and return a promise. The producer function signature
   * must conform to the types of the ThrottledPromiseAll when constructed.
   */
  public add(
    source: T | T[],
    producer: (source: T, throttledPromise: ThrottledPromiseAll<T, O | undefined>) => Promise<O | undefined>
  ): void {
    ensureArray(source).forEach((s) => this.queue.push({ source: s, producer }));
  }

  /**
   * Returns a promise that resolves the items present in the queue using the associated producer.
   *
   * This function will throw an error if the timeout is reached before all items in the queue are resolved (see {@link PromiseOptions.timeout}).
   *
   * @returns A promise that resolves to an array of results.
   */
  public async all(): Promise<Array<O | undefined>> {
    let timeoutPromise: Promise<void> | undefined;
    if (this.wait.milliseconds > 0) {
      if (!this.timeout) {
        timeoutPromise = new Promise((resolve, reject) => {
          this.timeout = setTimeout(() => {
            try {
              if (this.timeout) {
                clearTimeout(this.timeout);
              }
              this.stop();
              reject(new Error(`PromiseQueue timed out after ${this.wait.milliseconds} milliseconds`));
            } catch (e) {
              reject(e);
            }
          }, this.wait.milliseconds);
        });
      }
    }
    try {
      if (timeoutPromise) {
        await Promise.race([this.dequeue(), timeoutPromise]);
      } else {
        await this.dequeue();
      }
      this.stop();
      return this.#results;
    } catch (e) {
      this.stop();
      throw e;
    }
  }

  private stop(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.queue.splice(0, this.queue.length);
  }

  private async dequeue(): Promise<void> {
    while (this.queue.length > 0) {
      const next = this.queue.slice(0, this.concurrency);
      this.queue.splice(0, this.concurrency);
      // eslint-disable-next-line no-await-in-loop
      const results = await Promise.all(
        next.map((item) => item.producer(item.source, this).catch((e) => Promise.reject(e)))
      );
      this.#results.push(...results);
    }
  }
}
