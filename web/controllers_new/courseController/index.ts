import { IDeleteLecture, IDeletesubcourse, IJoinleaveInterface, IPostCourse,
         IPostlecture, IPostSubcourse, IPutcourse, IPutlecture, IPutsubcourse,
         IGroupMail, IInstructormail, IGetCourses, IGetCourse,
         IPostaddcourseInstructor, IImageHandler, IIssueCertificate, ApiCourseTag }
    from './../../controllers/courseController/format';
import { Pupil } from '../../../common/entity/Pupil';
import { Student } from '../../../common/entity/Student';
import { Request, Response } from 'express';
import { getLogger } from 'log4js';
import { deleteCourse, deleteLecture, deleteSubcourse, getCourse,
         getCourses, getCourseTags, groupMail, instructorMail,
         inviteExternal, issueCourseCertificate, joinCourseMeeting,
         joinCourseMeetingExternalGuest, joinSubcourse, joinWaitingList,
         leaveSubcourse, leaveWaitingList,
         postAddCourseInstructor, postCourse, postLecture, postSubcourse,
         putCourse, putLecture, putSubcourse, setCourseImage, testJoinCourseMeeting
} from '../../../web/services/courseService';


const logger = getLogger();

export const getCoursesHandler = async (
    req: Request,
    res: Response
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

export const getCourseHandler = async (
    req: Request,
    res: Response
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

export const getCourseTagsHandler = async (
    req: Request,
    res: Response
) => {
    let status = 200;
    try {
        const requestHandler: ApiCourseTag[] = await getCourseTags();
        res.json(requestHandler);
    } catch (e) {
        logger.error('Get course tags failed with: ', e);
        status = 500;
    }
    res.status(status).end();
};

export const postCourseHandler = async (
    req: Request,
    res: Response
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

export const postSubCourseHandler = async (
    req: Request,
    res: Response
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

export const postLectureHandler = async (
    req: Request,
    res: Response
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

export const putCourseHandler = async (req: Request, res: Response) => {
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

export const putSubcourseHandler = async (req: Request, res:Response) => {
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

export const putLectureHandler = async (req: Request, res: Response) => {
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

export const deleteCourseHandler = async (req: Request, res: Response) => {
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

export const deleteSubcourseHandler = async (req: Request, res: Response) => {
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

export const deleteLectureHandler = async (req: Request, res: Response) => {
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


export const joinSubcourseHandler = async (req: Request, res: Response) => {
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


export const joinWaitingListHandler = async (req: Request, res: Response) => {
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

export const leaveSubcourseHandler = async (req: Request, res: Response) => {
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

export const leaveWaitingListHandler = async (req: Request, res: Response) => {
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

export const groupMailHandler = async (req: Request, res: Response) => {
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

export const instructorMailHandler = async (req: Request, res: Response) => {
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

export const joinCourseMeetingHandler = async(req: Request, res:Response) => {
    const courseId = req.params.id ? req.params.id : null;
    const subcourseId = req.params.subid ? String(req.params.subid) : null;
    const ip = req.connection.remoteAddress ? req.connection.remoteAddress : null;
    let status = 200;

    try {
        let requestObject = {
            user: res.locals.user,
            courseId,
            subcourseId,
            ip
        };

        const requestHandler = await joinCourseMeeting(requestObject);

        if (typeof requestHandler == 'number') {
            status = requestHandler;
        } else {
            res.send(requestHandler);
        }

    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        return 500;
    }

    res.status(status).end();
};

export const testJoinCourseMeetingHandler = async(req: Request, res:Response) => {
    let status = 200;
    const user: Student | Pupil | undefined = res.locals.user;

    try {
        const requestHandler: string = await testJoinCourseMeeting(user);
        res.redirect(requestHandler);
    } catch (e) {
        logger.error("An error occurred during GET /course/test/meeting/join: " + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
};

export async function postAddCourseInstructorHandler(req: Request, res:Response) {
    let status = 200;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                Number.isInteger(+req.params.id) &&
                typeof req.body.email == 'string') {

                if (status < 300) {
                    const requestObject: IPostaddcourseInstructor = {
                        student: res.locals.user,
                        courseID: +req.params.id,
                        apiInstructorToAdd: req.body
                    };
                    status = await postAddCourseInstructor(requestObject);
                }
            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/instructor");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to add an instructor to a course");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

export async function putCourseImageHandler(req: Request, res: Response) {
    let status = 200;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                Number.isInteger(+req.params.id)) {
                if (!req.file) {
                    status = 400;
                    logger.warn(`PUT /course/:id/image expects either a PNG, JPEG or GIF file`);
                }

                if (status < 300) {
                    const requestObject: IImageHandler = {
                        student: res.locals.user,
                        courseID: +req.params.id,
                        imageFile: req.file
                    };
                    const result = await setCourseImage(requestObject);
                    if (typeof result === "number") {
                        status = result;
                    } else {
                        res.send(result);
                    }
                }
            } else {
                status = 400;
                logger.warn("Invalid request for PUT /course/:id/image");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to change course image");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

export async function deleteCourseImageHandler(req: Request, res: Response) {
    let status = 200;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                Number.isInteger(+req.params.id)) {
                if (status < 300) {
                    const requestObject: IImageHandler = {
                        student: res.locals.user,
                        courseID: +req.params.id,
                        imageFile: null
                    };

                    const result = await setCourseImage(requestObject);

                    if (typeof result === "number") {
                        status = result;
                    } else {
                        res.send(result);
                    }
                }
            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id/image");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to delete course image");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

export async function inviteExternalHandler(req: Request, res: Response) {
    let status: number;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                typeof req.body.firstname === "string" && req.body.firstname.length > 0 && //oh shit... this is soooo dirty...
                typeof req.body.lastname === "string" && req.body.lastname.length > 0 &&
                typeof req.body.email === "string" && req.body.email.length > 0) {

                const requestObject = {
                    student: res.locals.user,
                    courseID: Number.parseInt(req.params.id, 10),
                    inviteeInfo: req.body
                };

                status = await inviteExternal(requestObject);

            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/subcourse/:subid/inviteexternal");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to invite an external person to a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

export async function joinCourseMeetingExternalHandler(req: Request, res: Response) {
    try {
        if (req.params.token != undefined) {
            const token = req.params.token;
            const result = await joinCourseMeetingExternalGuest(token);

            if (typeof result === "number") {
                res.status(result).end();
            } else {
                //successfully got join url
                res.send(result);
                return;
            }
        } else {
            logger.warn("Invalid request for POST /course/meeting/external/join/:token");
            logger.debug(req.body);
            res.status(400).end();
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        res.status(500).end();
    }
}

export async function issueCourseCertificateHandler(req: Request, res: Response) {

    let status = 204;

    if (res.locals.user instanceof Student) {
        if (req.params.id != undefined
            && req.params.subid != undefined
            && req.body.receivers instanceof Array) {
            const requestObject: IIssueCertificate = {
                student: res.locals.user,
                courseId: Number.parseInt(req.params.id, 10),
                subcourseId: Number.parseInt(req.params.subid, 10),
                receivers: req.body.receivers
            };
            status = await issueCourseCertificate(requestObject);
        } else {
            logger.warn("Missing or invalid parameters for issueCourseCertificate");
            status = 400;
        }
    } else {
        logger.warn("Issuing course certificate requested by Non-Student");
        status = 403;
    }

    res.status(status).end();
}