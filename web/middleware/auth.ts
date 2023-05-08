import { Request, Response } from 'express';

// TODO: refactor method to use EMAIL_TOKEN secret
export function authCheckFactory(
    optional = false,
    useQueryParams = false,
    loadEagerRelations = true,
    studentDefaultRelations = [],
    pupilDefaultRelations = []
) {
    return function (req: Request, res: Response, next) {
        res.status(403).send('Invalid token specified.').end();
    };
}
