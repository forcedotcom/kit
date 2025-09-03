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
 * Normalize an object to be an array if it isn't one.
 *
 * @param entryOrArray - An object that could be an array of its type or just its type
 * @returns An array of the input element (which might be empty)
 */

export const ensureArray = <T>(entryOrArray: T | T[] | undefined): T[] => {
  if (entryOrArray !== undefined && entryOrArray !== null) {
    return Array.isArray(entryOrArray) ? entryOrArray : [entryOrArray];
  }
  return [];
};
