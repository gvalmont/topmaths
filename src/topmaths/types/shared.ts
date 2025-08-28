/**
 * Deep copy an object, not only the first level.
 * Does not work with functions, undefined, NaN, Infinity, -Infinity
 */
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function isStrings(obj: unknown): obj is string[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every((item) => typeof item === 'string')
}

export function isEmptyRecord(
  obj: Record<string | number | symbol, unknown>,
): boolean {
  return Object.values(obj).every((value) => !!value)
}
export function isEmptyArrayRecord(
  obj: Record<string | number | symbol, unknown[]>,
): boolean {
  return Object.values(obj).every((value) => value.length === 0)
}

export type ReplaceReferencesByStrings<R, T> = {
  [K in keyof T]: T[K] extends R
    ? string
    : T[K] extends object
      ? ReplaceReferencesByStrings<R, T[K]>
      : T[K]
}

type TupleToArray<T> = T extends [infer U, ...unknown[]] ? U[] : T

export type TuplesToArraysRecursive<T> = {
  [K in keyof T]: T[K] extends object
    ? TuplesToArraysRecursive<TupleToArray<T[K]>>
    : TupleToArray<T[K]>
}
