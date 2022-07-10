//array intersection
export function intersection<T>(arrA: T[], arrB: T[]) {
    return arrA.filter((x) => arrB.includes(x));
}

export function splitAtIndex(s: string, index: number): [string, string] {
    return [s.substring(0, index), s.substring(index)];
}

export function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 Checks whether a specified command line argument is set.
 If there is a short version of the argument, it can be supplied to check for both.
 Dashes are replaced.
 **/
export function isCommandArg(arg: string, short?: string): boolean {
    return process.argv
        .slice(2)
        .some(a => a.replace("--", "") === arg.replace("--", "") ||
            a.replace("-", "") === short.replace("-", ""));
}


export const assertExists = <Type>(optional: Type | null | undefined): Type | never => {
    if (optional === null || optional === undefined) {
        throw new Error(`Unexpected null or undefined`);
    }
    return optional;
};

// Calls 'initializer' once the returned promise is first 'await'ed, then resolves the promise with the result
export function init<T>(initializer: () => PromiseLike<T>): PromiseLike<T> {
    return {
        then(resolve: any, reject: any) {
            return initializer().then(resolve, reject);
        }
    };
}