import { Request, Response, NextFunction } from "express";
import { ApiMatchingOptions } from "./types/matching-options";
import { ApiMatchingRestrictions } from "./types/matching-restrictions";
import { plainToClass } from 'class-transformer';
import { validateOrReject } from "class-validator";

/// Takes the given `obj`, converts it to the class specified by the given `constructor` and validates it with the type as specified with the generic type parameter.
async function parseAndValidate<T extends object>(constructor: new () => T, obj: object) {
    if (!obj) {
        throw new Error("Cannot parse undefined object!");
    }

    const convertedObj = plainToClass(constructor, obj);
    await validateOrReject(convertedObj, {
        forbidUnknownValues: true,
        whitelist: true,
        forbidNonWhitelisted: true
    });
    return convertedObj;
}

/// Parses the value corresponding to a given key from a given body object.
/// If parsing fails, it will throw an error indicating that a property is missing.
/// This is thought to be used as an express middleware.
function getOrRejectBodyValue(body: any, key: string) {
    if (!body) {
        throw new Error("No body given!");
    }
    const value = body[key];
    if (!value) {
        throw new Error(`Missing property '${key}' in body!`);
    }
    return value;
}


/// Parses the given body and returns the parsed matching restrictions and matching options
async function parseBodyOrReject(body: any) {
    const parsedRestrictions = getOrRejectBodyValue(body, "restrictions");
    const parsedOptions = getOrRejectBodyValue(body, "options");

    const restrictions = await parseAndValidate(ApiMatchingRestrictions, parsedRestrictions);
    const options = await parseAndValidate(ApiMatchingOptions, parsedOptions);

    return { restrictions, options };
}

/// An express middleware that validates the request, parses the parameters and executes the given handler with the parsed parameters.
export function validateRequestAndExecuteWithHandler(handler: (matchingRestrictions: ApiMatchingRestrictions, matchingOptions: ApiMatchingOptions, res: Response) => Promise<void>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        let restrictions: ApiMatchingRestrictions;
        let options: ApiMatchingOptions;

        //check
        try {
            ({ restrictions, options } = await parseBodyOrReject(req.body));
        } catch (e) {
            res.status(400).send(`Invalid request: \n ❌ ${[e].flat().join("\n ❌ ")}`);
            return;
        }

        await handler(restrictions, options, res);
        return next();
    };
}