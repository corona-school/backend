import { Pupil } from '../../../common/entity/Pupil';
import { Student } from '../../../common/entity/Student';
import { NextFunction, Request, Response } from 'express';
import { getLogger } from 'log4js';
import {
    deleteCourseHandlerSERVICE,
    deleteLectureHandlerSERVICE,
    deleteSubcourseHandlerSERVICE,
    getCourseHandlerSERVICE,
    getCoursesHandlerSERVICE,
    getCourseTagsHandlerSERVICE,
    groupMailHandlerSERVICE,
    instructorMailHandlerSERVICE,
    joinSubcourseHandlerSERVICE,
    joinWaitingListHandlerSERVICE,
    leaveSubcourseHandlerSERVICE,
    leaveWaitingListHandlerSERVICE,
    postCourseHandlerSERVICE,
    postLectureHandlerSERVICE,
    postSubcourseHandlerSERVICE,
    putCourseHandlerSERVICE,
    putLectureHandlerSERVICE,
    putSubcourseHandlerSERVICE
} from '../../services/courseService';

const logger = getLogger();

export const getCoursesHandlerREST = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 200;
    try {
        let authenticatedStudent: Student | boolean = false;
        let authenticatedPupil: Pupil | boolean = false;

        if (res.locals.user instanceof Student) {
            authenticatedStudent = true;
        }

        if (res.locals.user instanceof Pupil) {
            authenticatedPupil = true;
        }

        let fields = [];
        if (typeof req.query.fields == 'string') {
            fields = req.query.fields.split(',');
        }

        let states = ['allowed'];
        if (typeof req.query.states == 'string') {
            states = req.query.states.split(',');
        }

        let instructorId = undefined;
        if (typeof req.query.instructor == 'string') {
            instructorId = req.query.instructor;
        }

        let participantId = undefined;
        if (typeof req.query.participant == 'string') {
            participantId = req.query.participant;
        }

        let onlyJoinableCourses = true;
        if (typeof req.query.onlyJoinableCourses == 'string') {
            onlyJoinableCourses = req.query.onlyJoinableCourses === 'true';
        }

        if (authenticatedStudent) {
            authenticatedStudent = res.locals.user;
        } else {
            authenticatedStudent = undefined;
        }

        if (authenticatedPupil) {
            authenticatedPupil = res.locals.user;
        } else {
            authenticatedPupil = undefined;
        }

        const getCourseHandlerObject = {
            authenticatedStudent,
            authenticatedPupil,
            fields,
            states,
            instructorId,
            participantId,
            onlyJoinableCourses
        };

        try {
            const requestHandler = await getCoursesHandlerSERVICE(
                getCourseHandlerObject
            );
            if (typeof requestHandler == 'number') {
                status = requestHandler;
            } else {
                res.json(requestHandler);
            }
        } catch (e) {
            logger.error('An error occurred during GET /courses: ' + e.message);
            logger.debug(req, e);
            status = 500;
        }
    } catch (e) {
        logger.error('Unexpected format of express request: ' + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
};

export const getCourseHandlerREST = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 200;
    try {
        if (req.params.id != undefined) {
            let authenticatedStudent = false;
            let authenticatedPupil = false;
            if (res.locals.user instanceof Student) {
                authenticatedStudent = true;
            }
            if (res.locals.user instanceof Pupil) {
                authenticatedPupil = true;
            }

            authenticatedStudent = authenticatedStudent
                ? res.locals.user
                : undefined;

            authenticatedPupil = authenticatedPupil
                ? res.locals.user
                : undefined;

            let id = Number.parseInt(req.params.id, 10);

            const requestGetCourseHandlerObject = {
                authenticatedStudent,
                authenticatedPupil,
                id
            };

            try {
                const requestHandler = await getCourseHandlerSERVICE(
                    requestGetCourseHandlerObject
                );

                if (typeof requestHandler == 'number') {
                    status = requestHandler;
                } else {
                    res.json(requestHandler);
                }
            } catch (e) {
                logger.error(
                    'An error occurred during GET /course: ' + e.message
                );
                logger.debug(req, e);
                status = 500;
            }
        } else {
            status = 400;
            logger.error('Expected id parameter on route');
        }
    } catch (e) {
        logger.error('Unexpected format of express request: ' + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
};

export const getCourseTagsHandlerREST = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 200;
    try {
        const requestHandler = await getCourseTagsHandlerSERVICE();
        res.json(requestHandler);
    } catch (e) {
        logger.error('Get course tags failed with: ', e);
        status = 500;
    }
    res.status(status).end();
};

export const postHandlerREST = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 200;

    try {
        if (res.locals.user instanceof Student) {
            if (
                req.body.instructors instanceof Array &&
                typeof req.body.name == 'string' &&
                typeof req.body.outline == 'string' &&
                typeof req.body.description == 'string' &&
                typeof req.body.category == 'string' &&
                req.body.tags instanceof Array &&
                typeof req.body.submit == 'boolean' &&
                typeof req.body.allowContact == 'boolean' &&
                (req.body.correspondentID == undefined ||
                    typeof req.body.correspondentID === 'string')
            ) {
                // Check if string arrays
                for (let i = 0; i < req.body.instructors.length; i++) {
                    if (typeof req.body.instructors[i] != 'string') {
                        status = 400;
                        logger.warn(
                            `Instructor ID ${req.body.instructors[i]} is no string`
                        );
                    }
                }

                for (let i = 0; i < req.body.tags.length; i++) {
                    if (typeof req.body.tags[i] != 'string') {
                        status = 400;
                        logger.warn(`Tag ID ${req.body.tags[i]} is no string`);
                    }
                }

                if (status < 300) {
                    try {
                        const newObj = {
                            user: res.locals.user,
                            body: req.body
                        };
                        const requestHandler = await postCourseHandlerSERVICE(
                            newObj
                        );

                        if (typeof requestHandler == 'number') {
                            status = requestHandler;
                        } else {
                            res.json(requestHandler);
                        }
                    } catch (e) {
                        status = 404;
                        logger.warn('The resource not found');
                        logger.debug(req.body);
                    }
                }
            } else {
                status = 400;
                logger.warn('Invalid request for POST /course');
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn('A non-student wanted to add a course');
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error('Unexpected format of express request: ' + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
};

export const postSubCourseHandlerREST = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 200;

    try {
        if (res.locals.user instanceof Student) {
            if (
                req.params.id != undefined &&
                req.body.instructors instanceof Array &&
                typeof req.body.minGrade == 'number' &&
                typeof req.body.maxGrade == 'number' &&
                (req.body.maxParticipants == undefined ||
                    typeof req.body.maxParticipants == 'number') &&
                typeof req.body.joinAfterStart == 'boolean' &&
                typeof req.body.published == 'boolean'
            ) {
                // Check if string arrays
                for (let i = 0; i < req.body.instructors.length; i++) {
                    if (typeof req.body.instructors[i] != 'string') {
                        status = 400;
                        logger.warn(
                            `Instructor ID ${req.body.instructors[i]} is no string`
                        );
                    }
                }

                if (status < 300) {
                    const id = Number.parseInt(req.params.id, 10);
                    const newObj = {
                        user: res.locals.user,
                        id: id,
                        body: req.body
                    };

                    try {
                        const requestHandler =
                            await postSubcourseHandlerSERVICE(newObj);
                        if (typeof requestHandler == 'number') {
                            status = requestHandler;
                        } else {
                            res.json(requestHandler);
                        }
                    } catch (e) {
                        logger.error(
                            'An error occurred during POST /course/:id/subcourse: ' +
                                e.message
                        );
                        logger.debug(req, e);
                        status = 500;
                    }
                }
            } else {
                status = 400;
                logger.warn('Invalid request for POST /course/:id/subcourse');
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn('A non-student wanted to add a subcourse');
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error('Unexpected format of express request: ' + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};

export const postLectureHandlerREST = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 200;
    try {
        if (res.locals.user instanceof Student) {
            if (
                req.params.id != undefined &&
                req.params.subid != undefined &&
                typeof req.body.instructor == 'string' &&
                typeof req.body.start == 'number' &&
                typeof req.body.duration == 'number'
            ) {
                if (status < 300) {
                    const courseId = Number.parseInt(req.params.id, 10);
                    const subCourseId = parseInt(req.params.subid, 10);

                    const obj = {
                        user: res.locals.user,
                        courseId,
                        subCourseId,
                        body: req.body
                    };

                    try {
                        const requestHandler = await postLectureHandlerSERVICE(
                            obj
                        );
                        if (typeof requestHandler == 'number') {
                            status = requestHandler;
                        } else {
                            res.json(requestHandler);
                        }
                    } catch (e) {
                        logger.error(
                            'An error occurred during POST /course/:id/subcourse/:subid/lecture: ' +
                                e.message
                        );
                        logger.debug(req, e);
                        status = 500;
                    }
                }
            } else {
                status = 400;
                logger.warn(
                    'Invalid request for POST /course/:id/subcourse/:subid/lecture'
                );
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn('A non-student wanted to add a lecture');
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error('Unexpected format of express request: ' + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
};

export const postCourseHandlerREST = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 204;

    try {
        if (res.locals.user instanceof Student) {
            if (
                req.params.id != undefined &&
                req.body.instructors instanceof Array &&
                (req.body.name == undefined ||
                    typeof req.body.name == 'string') &&
                (req.body.outline == undefined ||
                    typeof req.body.outline == 'string') &&
                typeof req.body.description == 'string' &&
                typeof req.body.allowContact === 'boolean' &&
                (req.body.correspondentID == undefined ||
                    typeof req.body.correspondentID === 'string') &&
                (req.body.outline == undefined ||
                    typeof req.body.category == 'string') &&
                req.body.tags instanceof Array &&
                (req.body.outline == undefined ||
                    typeof req.body.submit == 'boolean')
            ) {
                // Check if string arrays
                for (let i = 0; i < req.body.instructors.length; i++) {
                    if (typeof req.body.instructors[i] != 'string') {
                        status = 400;
                        logger.warn(
                            `Instructor ID ${req.body.instructors[i]} is no string`
                        );
                    }
                }
                for (let i = 0; i < req.body.tags.length; i++) {
                    if (typeof req.body.tags[i] != 'string') {
                        status = 400;
                        logger.warn(`Tag ID ${req.body.tags[i]} is no string`);
                    }
                }

                if (status < 300) {
                    const courseId = Number.parseInt(req.params.id, 10);
                    const newObj = {
                        user: res.locals.user,
                        courseId,
                        body: req.body
                    };
                    status = await putCourseHandlerSERVICE(newObj);
                }
            } else {
                status = 400;
                logger.warn('Invalid request for PUT /course');
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn('A non-student wanted to edit a course');
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error('Unexpected format of express request: ' + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};

export const putSubcourseHandlerREST = async (req: Request, res:Response, next: NextFunction) => {
    let status = 204;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.body.instructors instanceof Array &&
                typeof req.body.minGrade == 'number' &&
                typeof req.body.maxGrade == 'number' &&
                typeof req.body.maxParticipants == 'number' &&
                typeof req.body.published == 'boolean' &&
                typeof req.body.joinAfterStart == 'boolean') {

                // Check if string array
                for (let i = 0; i < req.body.instructors.length; i++) {
                    if (typeof req.body.instructors[i] != 'string') {
                        status = 400;
                        logger.warn(`Instructor ID ${req.body.instructors[i]} is no string`);
                    }
                }

                if (status < 300) {
                    const courseId = Number.parseInt(req.params.id, 10);
                    const SubCourseId = Number.parseInt(req.params.subid, 10);
                    const newObj = {
                        user: res.locals.user,
                        courseId,
                        SubCourseId,
                        body: req.body
                    };
                    status = await putSubcourseHandlerSERVICE(newObj);
                }
            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/subcourse");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to add a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};

export const putLectureHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status: number;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.lecid != undefined &&
                typeof req.body.instructor == 'string' &&
                typeof req.body.start == 'number' &&
                typeof req.body.duration == 'number') {

                const courseId = Number.parseInt(req.params.id, 10);
                const SubCourseId = Number.parseInt(req.params.subid, 10);
                const LectureId = Number.parseInt(req.params.lecid, 10);
                const newObj = {
                    user: res.locals.user,
                    courseId,
                    SubCourseId,
                    LectureId,
                    body: req.body
                };
                status = await putLectureHandlerSERVICE(newObj);

            } else {
                status = 400;
                logger.warn("Invalid request for PUT /course/:id/subcourse/:subid/lecture/:lecid");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to edit a lecture");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};

export const deleteCourseHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status: number;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined) {
                const courseId = Number.parseInt(req.params.id, 10);
                const newObj = {
                    user: res.locals.user,
                    courseId
                };

                status = await deleteCourseHandlerSERVICE(newObj);
            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to cancel a course");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};

export const deleteSubcourseHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status = 204;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined && req.params.subid != undefined) {

                const courseId = Number.parseInt(req.params.id, 10);
                const SubCourseId = Number.parseInt(req.params.subid, 10);
                const newObj = {
                    user: res.locals.user,
                    courseId,
                    SubCourseId
                };

                status = await deleteSubcourseHandlerSERVICE(newObj);

            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id/subcourse/:subid");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to cancel a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};

export const deleteLectureHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status: number;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.lecid != undefined) {
                const courseId = Number.parseInt(req.params.id, 10);
                const SubCourseId = Number.parseInt(req.params.subid, 10);
                const LectureId = Number.parseInt(req.params.lecid, 10);
                const newObj = {
                    user: res.locals.user,
                    courseId,
                    SubCourseId,
                    LectureId
                };
                status = await deleteLectureHandlerSERVICE(newObj);

            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id/subcourse/:subid/lecture/:lecid");
                logger.debug(req.params);
            }
        } else {
            status = 403;
            logger.warn("A non-student wants to delete a lecture");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};


export const joinSubcourseHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status: number;
    try {
        if (res.locals.user instanceof Pupil) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.userid != undefined) {

                const courseId = Number.parseInt(req.params.id, 10);
                const SubCourseId = Number.parseInt(req.params.subid, 10);
                const userId = Number.parseInt(req.params.userid, 10);
                const newObj = {
                    user: res.locals.user,
                    courseId,
                    SubCourseId,
                    userId
                };
                status = await joinSubcourseHandlerSERVICE(newObj);

            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/subcourse/:subid/participants");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-pupil wanted to join a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};


export const joinWaitingListHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status: number;
    try {
        if (res.locals.user instanceof Pupil) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.userid != undefined) {
                const courseId = Number.parseInt(req.params.id, 10);
                const SubCourseId = Number.parseInt(req.params.subid, 10);
                const userId = Number.parseInt(req.params.userid, 10);
                const newObj = {
                    user: res.locals.user,
                    courseId,
                    SubCourseId,
                    userId
                };
                status = await joinWaitingListHandlerSERVICE(newObj);

            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/subcourse/:subid/waitinglist");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-pupil wanted to join the waiting list of a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};

export const leaveSubcourseHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status: number;
    try {
        if (res.locals.user instanceof Pupil) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.userid != undefined) {

                const courseId = Number.parseInt(req.params.id, 10);
                const SubCourseId = Number.parseInt(req.params.subid, 10);
                const userId = Number.parseInt(req.params.userid, 10);
                const newObj = {
                    user: res.locals.user,
                    courseId,
                    SubCourseId,
                    userId
                };
                status = await leaveSubcourseHandlerSERVICE(newObj);

            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id/subcourse/:subid/participants/:userid");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-pupil wanted to leave a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};

export const leaveWaitingListHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status: number;
    try {
        if (res.locals.user instanceof Pupil) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.userid != undefined) {

                const courseId = Number.parseInt(req.params.id, 10);
                const SubCourseId = Number.parseInt(req.params.subid, 10);
                const userId = Number.parseInt(req.params.userid, 10);
                const newObj = {
                    user: res.locals.user,
                    courseId,
                    SubCourseId,
                    userId
                };
                status = await leaveWaitingListHandlerSERVICE(newObj);

            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id/subcourse/:subid/waitinglist/:userid");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-pupil wanted to leave a subcourse's waitinglist");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
};

export const groupMailHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status = 204;

    if (res.locals.user instanceof Student) {
        if (req.params.id != undefined
            && req.params.subid != undefined
            && typeof req.body.subject == "string"
            && typeof req.body.body == "string") {

            const courseId = Number.parseInt(req.params.id, 10);
            const SubCourseId = Number.parseInt(req.params.subid, 10);
            const userId = Number.parseInt(req.params.userid, 10);
            const newObj = {
                user: res.locals.user,
                courseId,
                SubCourseId,
                mailSubject: req.body.subject,
                mailBody: req.body.body
            };
            status = await groupMailHandlerSERVICE(newObj);

        } else {
            logger.warn("Missing or invalid parameters for groupMailHandler");
            status = 400;
        }
    } else {
        logger.warn("Groupmail requested by Non-Student");
        status = 403;
    }

    res.status(status).end();
};

export const instructorMailHandlerREST = async (req: Request, res: Response, next: NextFunction) => {
    let status = 204;

    if (res.locals.user instanceof Pupil) {
        if (req.params.id != undefined
            && req.params.subid != undefined
            && typeof req.body.subject == "string"
            && typeof req.body.body == "string") {

            const courseId = Number.parseInt(req.params.id, 10);
            const SubCourseId = Number.parseInt(req.params.subid, 10);
            const userId = Number.parseInt(req.params.userid, 10);
            const newObj = {
                user: res.locals.user,
                courseId,
                SubCourseId,
                mailSubject: req.body.subject,
                mailBody: req.body.body
            };
            status = await instructorMailHandlerSERVICE(newObj);
        } else {
            logger.warn("Missing or invalid parameters for instructorMailHandler");
            status = 400;
        }
    } else {
        logger.warn("Instructor mail requested by Non-Pupil");
        status = 403;
    }

    res.status(status).end();
};