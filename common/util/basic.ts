//array intersection
function intersection<T>(arrA: T[], arrB: T[]) {
    return arrA.filter((x) => arrB.includes(x));
}

function splitAtIndex(s: string, index: number): [string, string] {
    return [s.substring(0, index), s.substring(index)];
}

function randomIntFromInterval(min: number, max: number) {
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
function friendlyFileSize(bytes, si = false, dp = 1) {
    let size = bytes;
    const thresh = si ? 1000 : 1024;

    if (Math.abs(size) < thresh) {
        return `${size} B`;
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        size /= thresh;
        u += 1;
    } while (
        Math.round(Math.abs(size) * r) / r >= thresh &&
        u < units.length - 1
    );

    return `${size.toFixed(dp)} ${units[u]}`;
}


export {
    intersection,
    randomIntFromInterval,
    splitAtIndex,
    friendlyFileSize
};
