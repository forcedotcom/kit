/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { expect } from 'chai';
import { Duration, ThrottledPromiseAll } from '../src';

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
      throttledPromiseAll.add(
        i,
        (source) => new Promise((resolve) => setTimeout(() => resolve(source + 1), (5 - i) * 100))
      );
    }
    await throttledPromiseAll.all();
    const results = throttledPromiseAll.results as number[];
    expect(results).to.deep.equal([1, 2, 3, 4, 5].map((i) => i + 1));
  });
  it('should execute promises in groups of 2 - auto start', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 2 });
    for (const i of [1, 2, 3, 4, 5]) {
      // eslint-disable-next-line no-await-in-loop
      throttledPromiseAll.add(i, numberProducer);
    }
    await throttledPromiseAll.all();
    const results = throttledPromiseAll.results as number[];
    expect(results).to.deep.equal([1, 2, 3, 4, 5].map((i) => i + 1));
  });
  it('should execute promises in groups of 10 - auto start', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 10 });
    for (const i of [1, 2, 3, 4, 5]) {
      // eslint-disable-next-line no-await-in-loop
      throttledPromiseAll.add(i, numberProducer);
    }
    await throttledPromiseAll.all();
    const results = throttledPromiseAll.results as number[];
    expect(results).to.deep.equal([1, 2, 3, 4, 5].map((i) => i + 1));
  });
  it('should reject', async () => {
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
  it('should timeout', async () => {
    try {
      const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({
        concurrency: 1,
        timeout: Duration.milliseconds(100),
      });
      throttledPromiseAll.add(
        [1, 2, 3, 4, 5],
        (source) => new Promise((resolve) => setTimeout(() => resolve(source + 1), 200))
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
        // add more to the queue after a couple of seconds
        if (source === 1) {
          return new Promise((resolve) => {
            setTimeout(() => {
              throttledPromise.add([2, 3, 4, 5], numberProducer);
              resolve(source + 1);
            }, 2000);
          });
        } else {
          return Promise.resolve(source + 1);
        }
      }
    );
    await throttledPromiseAll.all();
    const results = throttledPromiseAll.results as number[];
    expect(results).to.deep.equal([1, 2, 3, 4, 5].map((i) => i + 1));
  });

  it('empty array', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 5 });
    await throttledPromiseAll.all();
    expect(throttledPromiseAll.results).to.deep.equal([]);
  });

  it('add single arg that returns undefined', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 5 });
    throttledPromiseAll.add(0, () => Promise.resolve(undefined));
    await throttledPromiseAll.all();
    expect(throttledPromiseAll.results).to.deep.equal([undefined]);
  });

  it('add single arg that returns null', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 5 });
    throttledPromiseAll.add(0, () => Promise.resolve(-10));
    await throttledPromiseAll.all();
    expect(throttledPromiseAll.results).to.deep.equal([-10]);
  });

  it('add with producer of undefined', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 5 });
    throttledPromiseAll.add(0, () => Promise.resolve(undefined));
    [1, 2, 3, 4, 5].forEach((i) => throttledPromiseAll.add(i, numberProducer));
    throttledPromiseAll.add(6, () => Promise.resolve(undefined));
    await throttledPromiseAll.all();
    expect(throttledPromiseAll.results).to.deep.equal([undefined, 2, 3, 4, 5, 6, undefined]);
  });

  it('multiple adds to check order/sort', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({ concurrency: 2 });
    throttledPromiseAll.add(0, () => Promise.resolve(undefined));
    [1, 2].forEach((i) => throttledPromiseAll.add(i, numberProducer));
    throttledPromiseAll.add(6, () => Promise.resolve(undefined));
    [6, 7].forEach((i) => throttledPromiseAll.add(i, numberProducer));
    throttledPromiseAll.add(6, () => Promise.resolve(undefined));
    await throttledPromiseAll.all();
    expect(throttledPromiseAll.results).to.deep.equal([undefined, 2, 3, undefined, 7, 8, undefined]);
  });

  it('should cancel', async () => {
    const throttledPromiseAll: ThrottledPromiseAll<number, number> = new ThrottledPromiseAll({
      concurrency: 5,
      cancel: () => true,
    });
    throttledPromiseAll.add(0, () => Promise.resolve(undefined));
    try {
      await throttledPromiseAll.all();
    } catch (e) {
      expect((e as Error).message).to.equal('PromiseQueue: Cancelled');
    }
  });
});
