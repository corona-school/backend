import { getLogger } from 'log4js';
import { Request, Response } from 'express';

const logger = getLogger();

export class HttpError extends Error {
    public readonly code: number;
    public readonly name: string;
    public readonly message: string;

    constructor(code: number, name: string, message: string) {
        super();
        this.code = code,
        this.name = name;
        this.message = message;
    }
}
