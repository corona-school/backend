import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Student } from "../../common/entity/Student";
import { Pupil } from "../../common/entity/Pupil";
import { hashToken } from "../../common/util/hashing";

export async function basicTokenCheck(req: Request, res: Response, next) {
    if (req.method == "OPTIONS") next();

    const token = req.get("Token");
    if (!token) {
        res.status(403).send("no token specified.").end();
        return;
    }
    return next();
}

export async function authCheck(req: Request, res: Response, next) {
    if (req.method == "OPTIONS") next();

    const token = req.get("Token");
    try {
        const entityManager = getManager();

        // Try to find student and continue request
        const student = await entityManager.findOne(Student, {
            authToken: hashToken(token),
            active: true,
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

        res.status(403).send("Invalid token specified.").end();
    } catch (e) {
        // database error
    }
}

export async function screenerAuthCheck(req: Request, res: Response, next) {
    if (req.method == "OPTIONS") next();

    const token = req.get("Token");
    if (token === process.env.SCREENER_AUTH_TOKEN) {
        return next();
    }
    res.status(403).send("Invalid token specified.").end();
    return;
}
