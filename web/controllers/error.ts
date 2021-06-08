import { getLogger } from 'log4js';
import { Request, Response } from 'express';

const logger = getLogger();

/* Throw somewhere inside handleError to abort the request and respond with an error code
   WARN: Be careful what you put into message, this is sent to the client. innerError stays private */
export class HTTPError extends Error {
    constructor(public code: number, message: string, public innerError?: Error) {
        super(message);
    }
}

/* Wrap an API endpoint into this to handle all HTTPErrors and uncatched errors gracefully and consistently */
export async function handleError(res: Response, handler: () => Promise<void | never>) {
    try {
        await handler();
    } catch (error) {
        if (error instanceof HTTPError) {
            logger.warn(error.message, error.innerError);
            return res.status(error.code).send(error.message);
        } else {
            logger.error(error);
            return res.status(500).send("Internal Server error");
        }
    }
}