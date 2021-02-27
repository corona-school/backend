import { getLogger } from "log4js";
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Pupil } from "../../../common/entity/Pupil";
import { Student } from "../../../common/entity/Student";
import { getTransactionLog } from "../../../common/transactionlog";
import VerifiedCodeEvent from "../../../common/transactionlog/types/VerifiedCodeEvent";
import {generateCode, sendVerificationSMS} from "../../../jobs/periodic/fetch/utils/verification";

const logger = getLogger();

export async function verifyCodeHandler(req: Request, res: Response) {
    if (req.body.wixId && req.body.code) {
        let wixId = req.body.wixId;
        let code = req.body.code;

        if (await isOnCooldown(wixId)) {
            return res.status(429).end();
        } else {
            let success = await verifyCode(wixId, code);
            if (success) {
                return res.status(200).send();
            } else {
                return res.status(400).end();
            }
        }
    } else {
        // code field missing
        return res.status(400).end();
    }
}

export async function requestCodeHandler(req: Request, res: Response) {
    if (req.body.wixId) {
        let wixId = req.body.wixId;

        let success = await requestCode(wixId);
        if (success) {
            return res.status(200).send();
        } else {
            return res.status(400).end();
        }
    } else {
        // code field missing
        return res.status(400).end();
    }
}

export async function verifyCode(wixId : string, code: string): Promise<boolean | null> {
    try {
        const entityManager = getManager();
        const transactionLog = getTransactionLog();

        // Try to find student
        let student = await entityManager.findOne(Student, {
            wix_id: wixId,
            code: code
        });

        if (student instanceof Student) {
            // Found valid student
            student.code = null;
            student.verifiedPhoneAt = new Date();
            logger.info("Code " + code + " verified");

            await entityManager.save(student);
            await transactionLog.log(new VerifiedCodeEvent(student));
            return true;
        }

        // Try to find pupil instead
        let pupil = await entityManager.findOne(Pupil, {
            wix_id: wixId,
            code: code
        });

        if (pupil instanceof Pupil) {
            // Found valid pupil
            pupil.code = null;
            pupil.verifiedPhoneAt = new Date();
            logger.info("Code " + code + " verified");

            await entityManager.save(pupil);
            await transactionLog.log(new VerifiedCodeEvent(pupil));
            return true;
        }

        logger.info("Can't verify code " + code);
        return false;
    } catch (e) {
        logger.error("Can't verify code: ", e.message);
        logger.debug(e);
        return false;
    }
}

export async function isOnCooldown(wixId : string): Promise<boolean | null> {
    try {
        const entityManager = getManager();

        // Try to find student
        let student = await entityManager.findOne(Student, {
            wix_id: wixId
        });

        let cooldown = 1000 * 60 * 60; // 1 hour

        if (student instanceof Student) {
            if (student.requestedCodeAt != null && student.requestedCodeAt.getTime() + cooldown > new Date().getTime()) {
                return true;
            }
            return false;
        }

        // Try to find pupil instead
        let pupil = await entityManager.findOne(Pupil, {
            wix_id: wixId
        });

        if (pupil instanceof Pupil) {
            if (pupil.requestedCodeAt != null && pupil.requestedCodeAt.getTime() + cooldown > new Date().getTime()) {
                return true;
            }
            return false;
        }
    } catch (e) {
        logger.error("Can't check cooldown: ", e.message);
        logger.debug(e);
    }
    return true;
}

export async function requestCode(wixId : string): Promise<boolean | null> {
    try {
        const entityManager = getManager();

        // Try to find student
        let student = await entityManager.findOne(Student, {
            wix_id: wixId
        });

        if (student instanceof Student) {
            student.code = generateCode();
            student.requestedCodeAt = new Date();

            await entityManager.save(student);
            await sendVerificationSMS(student.phone, student.firstname, student.code);
            return;
        }

        // Try to find pupil instead
        let pupil = await entityManager.findOne(Pupil, {
            wix_id: wixId
        });

        if (pupil instanceof Pupil) {
            pupil.code = generateCode();
            pupil.requestedCodeAt = new Date();

            await entityManager.save(pupil);
            await sendVerificationSMS(pupil.phone, pupil.firstname, pupil.code);
            return;
        }

        logger.info("Can't request code for user " + wixId);
        return false;
    } catch (e) {
        logger.error("Can't request code: ", e.message);
        logger.debug(e);
        return false;
    }
}