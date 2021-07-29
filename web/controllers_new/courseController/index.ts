import { IDeleteLecture, IDeletesubcourse, IJoinleaveInterface, IPostCourse, IPostlecture, IPostSubcourse, IPutcourse, IPutlecture, IPutsubcourse, responseError, IGroupMail, IInstructormail, IGetCourses, IGetCourse } from './../../controllers/courseController/format';
import { Pupil } from '../../../common/entity/Pupil';
import { Student } from '../../../common/entity/Student';
import { NextFunction, Request, Response } from 'express';
import { getLogger } from 'log4js';
import { deleteCourse, deleteLecture, deleteSubcourse, getCourse, getCourses, getCourseTags, groupMail, instructorMail, joinSubcourse, joinWaitingList, leaveSubcourse, leaveWaitingList, postCourse, postLecture, postSubcourse, putCourse, putLecture, putSubcourse } from '../../../web/services/courseService';


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

        try {
            const requestObject: IGetCourses = {
                student: authenticatedStudent ? res.locals.user : undefined,
                pupil: authenticatedPupil ? res.locals.user : undefined,
                fields,
                states,
                instructorId,
                participantId,
                onlyJoinableCourses
            };

            const requestHandler = await getCourses(requestObject);

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

            try {
                const requestObject: IGetCourse = {
                    student: authenticatedStudent
                        ? res.locals.user
                        : undefined,
                    pupil: authenticatedPupil
                        ? res.locals.user
                        : undefined,
                    courseId: Number.parseInt(req.params.id, 10)
                };

                const requestHandler = await getCourse(requestObject);

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

export const getCourseTagsREST = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 200;
    try {
        const requestHandler = await getCourseTags();
        res.json(requestHandler);
    } catch (e) {
        logger.error('Get course tags failed with: ', e);
        status = 500;
    }
    res.status(status).end();
};

export const postCourseREST = async (
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
                        const requestObject: IPostCourse = {
                            student: res.locals.user,
                            apiCourse: req.body
                        };

                        const requestHandler = await postCourse(requestObject);

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
                    try {
                        const requestObject: IPostSubcourse = {
                            student: res.locals.user,
                            courseId: Number.parseInt(req.params.id, 10),
                            apiSubcourse: req.body
                        };

                        const requestHandler =
                            await postSubcourse(requestObject);
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
                    const requestObject: IPostlecture = {
                        student: res.locals.user,
                        courseId: Number.parseInt(req.params.id, 10),
                        subcourseId: Number.parseInt(req.params.subid, 10),
                        apiLecture: req.body
                    };

                    try {
                        const requestHandler = await postLecture(requestObject);

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
                    const requestObject: IPutcourse = {
                        student: res.locals.user,
                        courseId: Number.parseInt(req.params.id, 10),
                        apiCourse: req.body
                    };
                    status = await putCourse(requestObject);
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
                    const requestObject: IPutsubcourse = {
                        student: res.locals.user,
                        courseId: Number.parseInt(req.params.id, 10),
                        subcourseId: Number.parseInt(req.params.subid, 10),
                        apiSubcourse: req.body
                    };
                    status = await putSubcourse(requestObject);
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


                const requestObject: IPutlecture = {
                    student: res.locals.user,
                    courseId: Number.parseInt(req.params.id, 10),
                    subcourseId: Number.parseInt(req.params.subid, 10),
                    lectureId: Number.parseInt(req.params.lecid, 10),
                    apiLecture: req.body
                };
                status = await putLecture(requestObject);

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
                const requestObject = {
                    student: res.locals.user,
                    courseId: Number.parseInt(req.params.id, 10)
                };

                status = await deleteCourse(requestObject.student, requestObject.courseId);
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
                const requestObject: IDeletesubcourse = {
                    student: res.locals.user,
                    courseId: Number.parseInt(req.params.id, 10),
                    subcourseId: Number.parseInt(req.params.subid, 10)
                };

                status = await deleteSubcourse(requestObject);

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
                const requestObject: IDeleteLecture = {
                    student: res.locals.user,
                    courseId: Number.parseInt(req.params.id, 10),
                    subcourseId: Number.parseInt(req.params.subid, 10),
                    lectureId: Number.parseInt(req.params.lecid, 10)
                };
                status = await deleteLecture(requestObject);

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

                const requestObject: IJoinleaveInterface = {
                    pupil: res.locals.user,
                    courseId: Number.parseInt(req.params.id, 10),
                    subcourseId: Number.parseInt(req.params.subid, 10),
                    userId: req.params.userid
                };
                status = await joinSubcourse(requestObject);

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
                const requestObject: IJoinleaveInterface = {
                    pupil: res.locals.user,
                    courseId: Number.parseInt(req.params.id, 10),
                    subcourseId: Number.parseInt(req.params.subid, 10),
                    userId: req.params.userid
                };
                status = await joinWaitingList(requestObject);

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

                const requestObject: IJoinleaveInterface = {
                    pupil: res.locals.user,
                    courseId: Number.parseInt(req.params.id, 10),
                    subcourseId: Number.parseInt(req.params.subid, 10),
                    userId: req.params.userid
                };
                status = await leaveSubcourse(requestObject);

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

                const requestObject: IJoinleaveInterface = {
                    pupil: res.locals.user,
                    courseId: Number.parseInt(req.params.id, 10),
                    subcourseId: Number.parseInt(req.params.subid, 10),
                    userId: req.params.userid
                };
                status = await leaveWaitingList(requestObject);

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
            const requestObject: IGroupMail = {
                student: res.locals.user,
                courseId: Number.parseInt(req.params.id, 10),
                subcourseId: Number.parseInt(req.params.subid, 10),
                mailSubject: req.body.subject,
                mailBody: req.body.body
            };
            status = await groupMail(requestObject);

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
            const requestObject: IInstructormail = {
                pupil: res.locals.user,
                courseId: Number.parseInt(req.params.id, 10),
                subcourseId: Number.parseInt(req.params.subid, 10),
                mailSubject: req.body.subject,
                mailBody: req.body.body
            };
            status = await instructorMail(requestObject);
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

// // export const joinCourseMeetingHandlerREST = async(req: Request, res:Response,
// //      next: NextFunction) => {
// //         const courseId = req.params.id ? req.params.id : null;
// //         const subcourseId = req.params.subid ? String(req.params.subid) : null;
// //         const ip = req.connection.remoteAddress ? req.connection.remoteAddress : null;
// //         let status = 200;

// //         try {
// //             let requestObject = {
// //                 user: res.locals.user,
// //                 courseId,
// //                 subcourseId,
// //                 ip
// //             };

// //             const request = await joinCourseMeetingHandlerSERVICE(requestObject);

// //         } catch (error) {

// //         }


// //         try {
// //             if (courseId != null && subcourseId != null) {
// //                 let authenticatedStudent = false;
// //                 let authenticatedPupil = false;
// //                 if (res.locals.user instanceof Student) {
// //                     authenticatedStudent = true;
// //                 }
// //                 if (res.locals.user instanceof Pupil) {
// //                     authenticatedPupil = true;
// //                 }
// //                 try {

// //                     if (authenticatedPupil || authenticatedStudent) {
// //                         if (meetingInDB) {
// //                             meeting = await getBBBMeetingFromDB(subcourseId);
// //                         } else {
// //                             // todo this should get its own method and not use a method from some other route
// //                             let obj = await getCourse(
// //                                 authenticatedStudent ? res.locals.user : undefined,
// //                                 authenticatedPupil ? res.locals.user : undefined,
// //                                 Number.parseInt(courseId, 10)
// //                             );

// //                             if (typeof obj == 'number') {
// //                                 status = obj;
// //                             } else {
// //                                 course = obj;
// //                                 meeting = await createBBBMeeting(course.name, subcourseId, res.locals.user);
// //                             }
// //                         }

// //                         if (!!meeting.alternativeUrl) {
// //                             res.send({ url: meeting.alternativeUrl });

// //                         } else if (authenticatedStudent) {
// //                             let user: Student = res.locals.user;

// //                             await startBBBMeeting(meeting);

// //                             res.send({
// //                                 url: getMeetingUrl(subcourseId, `${user.firstname} ${user.lastname}`, meeting.moderatorPW)
// //                             });

// //                         } else if (authenticatedPupil) {
// //                             const meetingIsRunning: boolean = await isBBBMeetingRunning(subcourseId);
// //                             if (meetingIsRunning) {
// //                                 let user: Pupil = res.locals.user;

// //                                 res.send({
// //                                     url: getMeetingUrl(subcourseId, `${user.firstname} ${user.lastname}`, meeting.attendeePW, user.wix_id)
// //                                 });

// //                                 // BBB logging
// //                                 await createOrUpdateCourseAttendanceLog(user, ip, subcourseId);

// //                             } else {
// //                                 status = 400;
// //                                 logger.error("BBB-Meeting has not startet yet");
// //                             }
// //                         }

// //                     } else {
// //                         status = 403;
// //                         logger.warn("An unauthorized user wanted to join a BBB-Meeting");
// //                         logger.debug(res.locals.user);
// //                     }

// //                 } catch (e) {
// //                     logger.error("An error occurred during GET /course/:id/subcourse/:subid/meeting/join: " + e.message);
// //                     logger.debug(req, e);
// //                     status = 500;
// //                 }
// //             } else {
// //                 status = 400;
// //                 logger.error("Expected courseId is not on route or subcourseId is not in request body");
// //             }
// //         } catch (e) {
// //             logger.error("Unexpected format of express request: " + e.message);
// //             logger.debug(req, e);
// //             status = 500;
// //         }
// //         res.status(status).end();
// // };




// // export const ?? = async(req: Request, res:Response, next: NextFunction) => {

// // };

// // export const ?? = async(req: Request, res:Response, next: NextFunction) => {

// // };

// // export const ?? = async(req: Request, res:Response, next: NextFunction) => {

// // };

// // export const ?? = async(req: Request, res:Response, next: NextFunction) => {

// // };

// // export const ?? = async(req: Request, res:Response, next: NextFunction) => {

// // };