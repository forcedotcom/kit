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
import { inspect } from 'node:util';
/**
 * Any `Error` compatible with the `NamedError` type signature.
 */
type NamedErrorLike =
  | Error
  | NamedError
  | {
      readonly name: string;
      readonly cause?: NamedErrorLike;
      readonly fullStack?: string;
    };

export class NamedError extends Error {
  public readonly name: string;
  public readonly cause?: NamedErrorLike;

  public constructor(name: string, cause?: NamedErrorLike);
  public constructor(name: string, message?: string, cause?: NamedErrorLike);
  public constructor(name: string, messageOrCause?: string | NamedErrorLike, cause?: NamedErrorLike) {
    if (typeof messageOrCause === 'string') {
      super(messageOrCause);
      this.cause = cause;
    } else {
      super();
      this.cause = messageOrCause;
    }
    this.name = name;
  }

  public get fullStack(): string | undefined {
    return inspect(this);
  }
}

export class JsonParseError extends NamedError {
  public constructor(
    cause: Error,
    public readonly path?: string,
    public readonly line?: number,
    public readonly errorPortion?: string
  ) {
    super('JsonParseError', JsonParseError.format(cause, path, line, errorPortion), cause);
  }

  /**
   * Creates a `JsonParseError` from a `SyntaxError` thrown during JSON parsing.
   *
   * @param error The `SyntaxError` to convert to a `JsonParseError`.
   * @param data The data input that caused the error.
   * @param jsonPath The path from which the data was read, if known.
   */
  public static create(error: SyntaxError, data: string, jsonPath?: string): JsonParseError {
    // Get the position of the error from the error message. This is the error index
    // within the file contents as 1 long string.
    const positionMatch = /position (\d+)/.exec(error.message);
    if (!positionMatch) {
      return new JsonParseError(error, jsonPath);
    }
    const errPosition = parseInt(positionMatch[1], 10);

    // Get a buffered error portion to display.
    const BUFFER = 20;
    const start = Math.max(0, errPosition - BUFFER);
    const end = Math.min(data.length, errPosition + BUFFER);

    const errorPortion = data.slice(start, end);

    // Only need to count new lines before the error position.
    const lineNumber = data.slice(0, errPosition).split('\n').length;

    return new JsonParseError(error, jsonPath, lineNumber, errorPortion);
  }

  private static format(cause: Error, path?: string, line?: number, errorPortion?: string): string {
    if (line == null) return cause.message || 'Unknown cause';
    return `Parse error in file ${path ?? 'unknown'} on line ${line}\n${errorPortion ?? cause.message}`;
  }
}

export class JsonStringifyError extends NamedError {
  public constructor(cause: Error) {
    super('JsonStringifyError', cause);
  }
}

export class JsonDataFormatError extends NamedError {
  public constructor(message: string) {
    super('JsonDataFormatError', message);
  }
}

export class InvalidDefaultEnvValueError extends NamedError {
  public constructor(message: string) {
    super('InvalidDefaultEnvValueError', message);
  }
}
