import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Student } from "../../common/entity/Student";
import { Pupil } from "../../common/entity/Pupil";
import { hashToken } from "../../common/util/hashing";
import { getLogger } from 'log4js';

const logger = getLogger();

export function authCheckFactory(optional = false) {
    return async function (req: Request, res: Response, next) {
        if (req.method == "OPTIONS") next();

        let token = req.get("Token");
        if (token == undefined) {
            token = 'invalid';
        }
        try {
            const entityManager = getManager();

            // Try to find student and continue request
            const student = await entityManager.findOne(Student, {
                where: {
                    authToken: hashToken(token),
                    active: true
                },
                relations: ['courses']
            });

            if (student instanceof Student) {
                student.authTokenUsed = true;
                await entityManager.save(student);

                res.locals.user = student;
                res.locals.userType = "student";
                return next();
            }

            // Try to find pupil and continue request
            const pupil = await entityManager.findOne(Pupil, {
                authToken: hashToken(token),
                active: true,
            });
            if (pupil instanceof Pupil) {
                pupil.authTokenUsed = true;
                await entityManager.save(pupil);

                res.locals.user = pupil;
                res.locals.userType = "pupil";
                return next();
            }

            if (optional) {
                return next();
            } else {
                res.status(403).send("Invalid token specified.").end();
            }
        } catch (e) {
            logger.debug(e);
            logger.error("Error in auth check: " + e.message);
        }
    }
}

export async function screenerAuthCheck(req: Request, res: Response, next) {
    if (req.method == "OPTIONS") next();

    const token = req.get("Token");
    if (token != undefined) {
        if (token === process.env.SCREENER_AUTH_TOKEN) {
            return next();
        }
    }
    res.status(403).send("Invalid token specified.").end();
    return;
}
