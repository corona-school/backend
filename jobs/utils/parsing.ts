import * as Papa from "papaparse";

export const parsePromise = function (file, config) {
    return new Promise<Papa.ParseResult>((resolve) => {
        Papa.parse(file, {
            complete: (results) => {
                resolve(results);
            },
            ...config,
        });
    });
};
