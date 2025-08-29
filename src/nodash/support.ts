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

// Support types specific to lodash constructs -- not intended for general reuse.
export type NotVoid = {} | null | undefined;
export type ValueIterateeCustom<T, R> = ((value: T) => R) | IterateeShorthand<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IterateeShorthand<T> = PropertyKey | [PropertyKey, any] | PartialDeep<T>;
export type PartialDeep<T> = { [P in keyof T]?: PartialDeep<T[P]> };
export type ObjectIterator<T, R> = (value: NonNullable<T[keyof T]>, key: string, collection: T) => R;
export type ObjectIteratee<T> = ObjectIterator<T, NotVoid> | IterateeShorthand<T[keyof T]>;
export type ListIterator<T, R> = (value: T, index: number, collection: ArrayLike<T>) => R;
export type ListIteratee<T> = ListIterator<T, NotVoid> | IterateeShorthand<T>;
export type ValueIteratee<T> = ((value: T) => NotVoid) | IterateeShorthand<T>;
export type Omit<T, K extends keyof T> = Pick<
  T,
  ({ [P in keyof T]: P } & { [P in K]: never } & { [x: string]: never })[keyof T]
>;
export type NumericDictionary<T> = { [key: number]: T };
