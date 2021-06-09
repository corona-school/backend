import { HTTPError } from "./error";
import { Request, Response } from "express";
import { ScreeningStatus, Student } from "../../common/entity/Student";
import { Course } from "../../common/entity/Course";

/* ----------- User Validation ---------------------------------------------------------------------------- */

export function isStudent(res: Response): void | never {
    if (!(res.locals.user instanceof Student))
        throw new HTTPError(403, "This endpoint can only be accessed by Students");
}

export function isPupil(res: Response): void | never {
    if (!(res.locals.user instanceof Student))
        throw new HTTPError(403, "This endpoint can only be accessed by Pupils");
}

// ATTENTION: This is asynchronous, don't forget to await!
export async function isAcceptedInstructor(student: Student): Promise<void | never> {
    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        throw new HTTPError(403, `Student (ID ${student.id}) tried to add a lecture, but is no instructor.`);
    }
}

export function isInstructorOf(student: Student, course: Course) {
    const authorized = course.instructors.some(it => it.id === student.id);

    if (!authorized) {
        throw new HTTPError(403, `User tried to edit lecture, but has no access rights (ID ${course.id})`);
    }
}



/* ----------- Request Validation ---------------------------------------------------------------------------- */

export function hasParams(req: Request, ...params: string[]): void | never {
    for (const param of params) {
        if (!(param in req.params) || !req.params[param] || Number.isNaN(Number.parseInt(req.params[param], 10))) {
            throw new HTTPError(400, `Missing integer parameter '${param}' in path`);
        }
    }
}

type BasicType = "string" | "boolean" | "number";

interface TypeMap {
    [key: string]: BasicType | `${BasicType}[]` | `${BasicType}?`;
}

export function hasBody(req: Request, body: TypeMap): void | never {
    for (const [key, type] of Object.entries(body)) {
        if (type.endsWith("[]")) {
            const innerType = { "string[]": "string", "number[]": "number", "boolean[]": "boolean" }[type];

            if (!(key in req.body))
                throw new HTTPError(400, `'${key}' is missing in the request body`);

            const value = req.body[key];

            if (!Array.isArray(value))
                throw new HTTPError(400, `Expected '${key}' to be an array, found ${typeof value} instead`);

            if (value.some(it => typeof it !== innerType))
                throw new HTTPError(400, `Expected elements of '${key}' to be of type ${innerType}, found something else instead`);
        } else if (type.endsWith("?")) {
            const innerType = { "boolean?": "boolean", "string?": "string", "number?": "number" }[type];

            if (key in req.body && typeof req.body[key] !== innerType)
                throw new HTTPError(400, `optional '${key}' in request body has invalid type ${typeof req.body[key]}, expected ${innerType}`);

        } else {
            if (!(key in req.body))
                throw new HTTPError(400, `'${key}' is missing in the request body`);

            if (typeof req.body[key] !== type)
                throw new HTTPError(400, `'${key}' in request body has invalid type ${typeof req.body[key]}, expected ${type}`);
        }
    }
}

export function isInIntegerRange<K extends string>(value: { [k in K]: number }, key: K, minInclusive: number, maxInclusive: number) {
    if (!Number.isInteger(value[key]))
        throw new HTTPError(400, `Expected '${key}' to be an integer was ${value[key]} instead`);

    if (value[key] < minInclusive || maxInclusive < value[key])
        throw new HTTPError(400, `Expected '${key}' to be inbetween ${minInclusive} and ${maxInclusive}, was outside with ${value[key]}`);
}

export function hasLength<K extends string>(value: { [k in K]?: string }, key: K, minInclusive: number, maxInclusive: number) {
    if (!(key in value))
        throw new HTTPError(400, `'${key}' is missing in the request body`);

    if (typeof value[key] !== "string")
        throw new HTTPError(400, `Expected '${key}' to be a string, found a ${typeof value[key]}  instead`);

    if (value[key].length < minInclusive || value[key].length > maxInclusive)
        throw new HTTPError(400, `'${key}' must be longer than ${minInclusive} and shorter than ${maxInclusive}. Instead it hat ${value[key].length} chars`);
}