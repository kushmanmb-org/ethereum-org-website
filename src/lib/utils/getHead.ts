/**
 * Returns the first element of an array, or undefined if the array is empty.
 *
 * @param arr - The array to get the first element from
 * @returns The first element of the array, or undefined if empty
 *
 * @example
 * ```ts
 * get_head([1, 2, 3]) // returns 1
 * get_head([]) // returns undefined
 * get_head(['a', 'b']) // returns 'a'
 * ```
 */
export const get_head = <T>(arr: T[]): T | undefined => {
  return arr[0]
}
