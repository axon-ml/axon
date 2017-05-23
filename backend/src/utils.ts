/**
 * Simple functional-programming utilities.
 */

/**
 * Left-fold operation. V8 does not yet support tail calls, so we write this iteratively.
 */
export function foldLeft<A, B>(arr: A[], zero: B, f: (b: B, a: A) => B): B {
    let result = zero;
    for (let idx = 0; idx < arr.length; idx++) {
        // Combine the result with the current element.
        result = f(result, arr[idx]);
    }
    return result;
}

/**
 * Map over an array including its indices. Never write another for-loop!
 * @param arr The input array
 * @param f Function of type (number, elem) => result.
 */
export function mapWithIndex<A, B>(arr: A[], f: (i: number, e: A) => B): B[] {
    const out = [];
    for (let i = 0; i < arr.length; i++) {
        out.push(f(i, arr[i]));
    }
    return out;
}
