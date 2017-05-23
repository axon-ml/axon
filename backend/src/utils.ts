/**
 * Simple functional-programming utilities.
 */

/**
 * Left-fold operation. V8 does not yet support tail calls, so we write this iteratively.
 */
export function foldLeft<A, B>(arr: A[], zero: B, f: (b: B, a: A) => B): B {
    let result = zero;
    let idx = 0;
    while (true) {
        if (idx >= arr.length) {
            break;
        }

        // Combine the result with the current element.
        result = f(result, arr[idx]);
        idx += 1;
    }
    return result;
}

export function mapWithIndex<A, B>(arr: A[], f: (i: number, e: A) => B): B[] {
    const out = [];
    for (let i = 0; i < arr.length; i++) {
        out.push(f(i, arr[i]));
    }
    return out;
}
