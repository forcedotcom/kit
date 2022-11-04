/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { expect } from 'chai';
import { ThrottledPromiseAll } from '../src/throttledPromiseAll';
import { Duration } from '../src/duration';

describe('throttledPromiseAll', () => {
  const numberProducer = (
    source: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    throttledPromise: ThrottledPromiseAll<number, number | undefined>
  ): Promise<number> => Promise.resolve(source + 1);

  it('should execute promises in order', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 1 });
    for (const i of [1, 2, 3, 4, 5]) {
      // eslint-disable-next-line no-await-in-loop
      throttledPromiseAll.add(i, numberProducer);
    }
    await throttledPromiseAll.all();
    const results = throttledPromiseAll.getResults() as number[];
    expect(results).to.deep.equal([1, 2, 3, 4, 5].map((i) => i + 1));
  });
  it('should execute promises in groups of 2 - auto start', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 2 });
    for (const i of [1, 2, 3, 4, 5]) {
      // eslint-disable-next-line no-await-in-loop
      throttledPromiseAll.add(i, numberProducer);
    }
    await throttledPromiseAll.all();
    const results = throttledPromiseAll.getResults() as number[];
    expect(results).to.deep.equal([1, 2, 3, 4, 5].map((i) => i + 1));
  });
  it('should execute promises in groups of 10 - auto start', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 10 });
    for (const i of [1, 2, 3, 4, 5]) {
      // eslint-disable-next-line no-await-in-loop
      throttledPromiseAll.add(i, numberProducer);
    }
    await throttledPromiseAll.all();
    const results = throttledPromiseAll.getResults() as number[];
    expect(results).to.deep.equal([1, 2, 3, 4, 5].map((i) => i + 1));
  });
  it('should should reject', async () => {
    try {
      const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({
        concurrency: 1,
        timeout: Duration.milliseconds(5000),
      });
      throttledPromiseAll.add([1], (source) => Promise.reject(new Error(`Promise ${source} rejected`)));
      await throttledPromiseAll.all();
    } catch (e) {
      expect((e as Error).message).to.equal('Promise 1 rejected');
    }
  });
  it('should should timeout', async () => {
    try {
      const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({
        concurrency: 1,
        timeout: Duration.milliseconds(100),
      });
      throttledPromiseAll.add(
        [1, 2, 3, 4, 5],
        (source) => new Promise((resolve) => setTimeout(() => resolve(source + 1), 10000))
      );
      await throttledPromiseAll.all();
    } catch (e) {
      expect((e as Error).message).to.equal('PromiseQueue timed out after 100 milliseconds');
    }
  });
  it('should add more to the queue', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 1 });
    throttledPromiseAll.add(
      1,
      (source: number, throttledPromise: ThrottledPromiseAll<number, number | undefined>): Promise<number> => {
        if (source === 1) {
          throttledPromise.add([2, 3, 4, 5], numberProducer);
        }
        return Promise.resolve(source + 1);
      }
    );
    await throttledPromiseAll.all();
    const results = throttledPromiseAll.getResults() as number[];
    expect(results).to.deep.equal([1, 2, 3, 4, 5].map((i) => i + 1));
  });
});
