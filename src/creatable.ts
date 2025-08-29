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

/**
 * A base class for classes that must be constructed and initialized asynchronously.
 */
export abstract class AsyncCreatable<O = object> {
  /**
   * Constructs a new `AsyncCreatable` instance. For internal and subclass use only.
   * New subclass instances must be created with the static {@link create} method.
   *
   * @param options An options object providing initialization params.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public constructor(options: O) {
    /* leave up to implementer */
  }

  /**
   * Asynchronously constructs and initializes a new instance of a concrete subclass with the provided `options`.
   *
   * @param options An options object providing initialization params to the async constructor.
   */
  public static async create<P, T extends AsyncCreatable<P>>(this: new (opts: P) => T, options: P): Promise<T> {
    const instance = new this(options);
    await instance.init();
    return instance;
  }

  /**
   * Asynchronously initializes newly constructed instances of a concrete subclass.
   */
  protected abstract init(): Promise<void>;
}

/**
 * A base class for classes that must be constructed and initialized asynchronously without requiring an options object.
 */
export abstract class AsyncOptionalCreatable<O = object> {
  /**
   * Constructs a new `AsyncCreatable` instance. For internal and subclass use only.
   * New subclass instances must be created with the static {@link create} method.
   *
   * @param options An options object providing initialization params.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public constructor(options?: O) {
    /* leave up to implementer */
  }

  /**
   * Asynchronously constructs and initializes a new instance of a concrete subclass with the optional `options`.
   *
   * @param options An options object providing initialization params to the async constructor.
   */
  public static async create<P extends object, T extends AsyncOptionalCreatable<P>>(
    this: new (opts?: P) => T,
    options?: P
  ): Promise<T> {
    const instance = new this(options);
    await instance.init();
    return instance;
  }

  /**
   * Asynchronously initializes newly constructed instances of a concrete subclass.
   */
  protected abstract init(): Promise<void>;
}
