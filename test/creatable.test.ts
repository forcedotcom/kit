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

import { expect } from 'chai';
import { AsyncCreatable, AsyncOptionalCreatable } from '../src/creatable';

class Config<O extends Config.Options> extends AsyncCreatable<O> {
  protected options: O;

  public constructor(options: O) {
    super(options);
    if (!options) throw new Error('I can haz options!');
    this.options = options;
  }

  public getFooEnabled(): boolean {
    return this.options.fooEnabled;
  }

  protected async init(): Promise<void> {
    await this.options.doAsyncThing();
  }
}

namespace Config {
  export type Options = {
    fooEnabled: boolean;
    doAsyncThing: () => Promise<void>;
  }
}

class SubConfig extends Config<SubConfig.Options> {
  public constructor(options: SubConfig.Options) {
    super(options);
  }

  public getBarEnabled(): boolean {
    return this.options.barEnabled;
  }

  protected async init(): Promise<void> {
    await super.init();
  }
}

namespace SubConfig {
  export type Options = {
    barEnabled: boolean;
  } & Config.Options
}

class OptionalConfig extends AsyncOptionalCreatable<OptionalConfig.Options> {
  protected options?: OptionalConfig.Options;

  public constructor(options?: OptionalConfig.Options) {
    super(options);
    this.options = options;
  }

  public getBazEnabled(): boolean {
    return this.options ? this.options.bazEnabled : false;
  }

  // eslint-disable-next-line class-methods-use-this
  protected async init(): Promise<void> {
    // Imagine cool async stuff here
  }
}

namespace OptionalConfig {
  export type Options = {
    bazEnabled: boolean;
  }
}

class NoOptionsConfig extends AsyncOptionalCreatable {
  public constructor() {
    super();
  }

  // eslint-disable-next-line class-methods-use-this
  protected async init(): Promise<void> {
    // Imagine cool async stuff here
  }
}

describe('AsyncCreatable', () => {
  it('should construct a concrete subclass async with options', async () => {
    let doAsyncThingRan = false;

    const config: Config<Config.Options> = await Config.create({
      fooEnabled: true,
      doAsyncThing: () => {
        doAsyncThingRan = true;
        return Promise.resolve();
      },
    });

    expect(doAsyncThingRan).to.be.true;
    expect(config.getFooEnabled()).to.be.true;
  });

  it('should construct a concrete sub-subclass async with options', async () => {
    let doAsyncThingRan = false;
    const config = await SubConfig.create({
      fooEnabled: true,
      doAsyncThing: () => {
        doAsyncThingRan = true;
        return Promise.resolve();
      },
      barEnabled: true,
    });

    expect(doAsyncThingRan).to.be.true;
    expect(config.getFooEnabled()).to.be.true;
    expect(config.getBarEnabled()).to.be.true;
  });

  it('should construct a concrete subclass async with optional options', async () => {
    const config1 = await OptionalConfig.create();

    expect(config1.getBazEnabled()).to.be.false;

    const config2 = await OptionalConfig.create({
      bazEnabled: true,
    });

    expect(config2.getBazEnabled()).to.be.true;
  });

  it('should construct a concrete subclass async with no options', async () => {
    await NoOptionsConfig.create();
  });
});
