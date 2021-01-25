import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Student } from "../../common/entity/Student";
import { Pupil } from "../../common/entity/Pupil";
import { hashToken } from "../../common/util/hashing";
import { getLogger } from 'log4js';
import { Expertise, Mentor } from "../../common/entity/Mentor";

const logger = getLogger();

export function authCheckFactory(optional = false, useQueryParams = false, loadEagerRelations = true, studentDefaultRelations = ['courses']) {
    return async function (req: Request, res: Response, next) {
        if (req.method == "OPTIONS") next();

        let token = req.get("Token");
        if (useQueryParams) {
            token = req.query.Token;
        }
        if (token == undefined) {
            token = 'invalid';
        }
        try {
            const entityManager = getManager();

            // Try to find student and continue request
            const student = await entityManager.findOne(Student, {
                where: [
                    {
                        authToken: hashToken(token),
                        active: true
                    },
                    {
                        authToken: token,
                        active: true
                    }
                ],
                relations: studentDefaultRelations,
                loadEagerRelations
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
                where: [
                    {
                        authToken: hashToken(token),
                        active: true
                    },
                    {
                        authToken: token,
                        active: true
                    }
                ],
                loadEagerRelations
            });
            if (pupil instanceof Pupil) {
                pupil.authTokenUsed = true;
                await entityManager.save(pupil);

                res.locals.user = pupil;
                res.locals.userType = "pupil";
                return next();
            }

            // Try to find mentor and continue request
            const mentor = await entityManager.findOne(Mentor, {
                where: [
                    {
                        authToken: hashToken(token),
                        active: true
                    },
                    {
                        authToken: token,
                        active: true
                    }
                ],
                loadEagerRelations
            });
            if (mentor instanceof Mentor) {
                mentor.authTokenUsed = true;

                // TODO: Workaround to prevent adding wrong " " to enums with spaces through TypeORM.
                // Enum expertise contains values with spaces. Division not.
                // See https://github.com/corona-school/backend/issues/138

                let convertedExpertises: Expertise[] = [];
                if (mentor.expertise.length > 0) {
                    const expertiseValues: string[] = Object.keys(Expertise).map(key => Expertise[key]);
                    for (let expertise of mentor.expertise) {
                        let replacedString = expertise.toString().replace(/"/g,"");
                        if (expertiseValues.indexOf(replacedString) > -1) {
                            const expertiseKey = Object.keys(Expertise).filter(x => Expertise[x] === replacedString);
                            convertedExpertises.push(Expertise[expertiseKey[0]]);
                        } else {
                            logger.warn("Expertise '" + expertise.toString() + "' is not a correct expertise");
                        }
                    }
                    if (mentor.expertise.length != convertedExpertises.length) {
                        logger.warn("Some expertises couldn't be saved.");
                        res.status(500).send("Error while saving updates.").end();
                    } else {
                        mentor.expertise = convertedExpertises;
                    }
                }

                await entityManager.save(mentor);

                res.locals.user = mentor;
                res.locals.userType = "mentor";
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
    };
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
