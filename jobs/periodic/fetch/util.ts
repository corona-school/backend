import { apiKey, apiUrl } from "./config";
import * as https from "https";
import { getLogger } from "log4js";

const logger = getLogger();

export const apiBase = apiUrl + apiKey;

export function buildQueryParam(date: Date) {
    return `year=${date.getUTCFullYear()}&month=${date.getUTCMonth()}&day=${date.getUTCDate()}&hour=${date.getUTCHours()}&min=${date.getUTCMinutes()}&sec=${date.getUTCSeconds()}&milli=${date.getUTCMilliseconds()}`;
}

export async function httpsGet(url: string) {
    return new Promise<string>((resolve, reject) => {
        https
            .get(
                url,
                {
                    rejectUnauthorized: true
                },
                (res) => {
                    let body = "";

                    res.on("data", (chunk) => {
                        body += chunk;
                    });
                    res.on("end", () => {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(body);
                        } else {
                            reject([res.statusMessage, res.statusCode, body]);
                        }
                    });
                    res.on("error", (err) => {
                        logger.warn("https connection error: ", err.message);
                        logger.debug(err);
                    });
                }
            )
            .on("error", (e) => {
                //due to async nature of https.get, we need to add a way for async error handling...
                logger.warn("https connection error: ", e.message);
                logger.debug(e);
                reject(e);
            });
    });
}

export async function safeApiQuery(queryUrl: string): Promise<object> {
    logger.debug("Querying " + queryUrl);
    let resp = await httpsGet(queryUrl);
    return JSON.parse(resp);
}
