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
 * Source: https://stackoverflow.com/a/14919494
 * CC BY-SA 4.0
 *
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function friendlyFileSize(bytes, si = false, dp = 1) {
    let size = bytes;
    const thresh = si ? 1000 : 1024;

    if (Math.abs(size) < thresh) {
        return `${size} B`;
    }

    const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        size /= thresh;
        u += 1;
    } while (Math.round(Math.abs(size) * r) / r >= thresh && u < units.length - 1);

    return `${size.toFixed(dp)} ${units[u]}`;
}

/**
 Checks whether a specified command line argument is set.
 If there is a short version of the argument, it can be supplied to check for both.
 Dashes are replaced.
 **/
export function isCommandArg(arg: string, short?: string): boolean {
    return process.argv.slice(2).some((a) => a.replace('--', '') === arg.replace('--', '') || a.replace('-', '') === short?.replace('-', ''));
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
        },
    };
}

export function isEmail(email: string): boolean {
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        email
    );
}

export function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array]; // Create a copy of the original array

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}
