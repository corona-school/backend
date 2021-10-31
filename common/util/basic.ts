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
    Checks whether a specified command line argument is set.
    If there is a short version of the argument, it can be supplied to check for both.
    Dashes are replaced.
**/
function isCommandArg(arg: string, short?: string): boolean {
    return process.argv
        .slice(2)
        .some(a => a.replace("--", "") === arg.replace("--", "") ||
            a.replace("-", "") === short.replace("-", ""));
}

export {
    intersection,
    randomIntFromInterval,
    splitAtIndex,
    isCommandArg
};
