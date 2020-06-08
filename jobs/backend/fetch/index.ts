import { apiBase, buildQueryParam, safeApiQuery } from "./util";
import { Student } from "../../../common/entity/Student";
import { ApiPupil, ApiResponse, ApiStudent } from "./api";
import { Pupil } from "../../../common/entity/Pupil";
import { getConnection, getManager } from "typeorm";
import { generateToken, sendVerificationMail } from "../verification";
import { getLogger } from "log4js";
import { getTransactionLog } from "../../../common/transactionlog";
import FetchedFromWixEvent from "../../../common/transactionlog/types/FetchedFromWixEvent";
import VerificationRequestEvent from "../../../common/transactionlog/types/VerificationRequestEvent";

const logger = getLogger();

let init = false;
let lastFetch: Date = new Date(new Date().getTime() - 3600000);
let apiMaxResults: number;

async function getStudentsAfter(date: Date): Promise<Student[]> {
    const queryUrl = apiBase + "/students/?" + buildQueryParam(date);
    let resp;

    try {
        resp = await safeApiQuery(queryUrl);
    } catch (e) {
        logger.error("Can't connect to student api: ", e.message);
        logger.debug(e);
    }

    try {
        let apiResp: ApiResponse<ApiStudent> = resp;
        let students = new Array<Student>();

        for (let i = 0; i < apiResp.items.length; i++) {
            let curr = apiResp.items[i];
            let s = new Student();
            s.subjects = JSON.stringify(curr.feldFurMehrfachauswahl);
            s.email = curr.email.toLowerCase();
            s.wix_id = curr._id;
            s.wix_creation_date = new Date(curr.submissionTime);
            s.lastname = curr.kopieVonVorname;
            s.firstname = curr.firstName;
            s.msg = curr.message;
            s.isStudent = true;

            students.push(s);
        }

        apiMaxResults = apiResp.maxCount;

        return students;
    } catch (e) {
        logger.error("Unexpected format of student api response: ", e.message);
        logger.debug(e);
    }

    return [];
}

async function getPupilsAfter(date: Date): Promise<Pupil[]> {
    const queryUrl = apiBase + "/pupils/?" + buildQueryParam(date);
    let resp;

    try {
        resp = await safeApiQuery(queryUrl);
    } catch (e) {
        logger.error("Can't connect to pupil api: ", e.message);
        logger.debug(e);
    }

    try {
        let apiResp: ApiResponse<ApiPupil> = resp;
        let pupils = new Array<Pupil>();

        for (let i = 0; i < apiResp.items.length; i++) {
            let curr = apiResp.items[i];

            let p = new Pupil();
            p.subjects = JSON.stringify(curr.feldFurMehrfachauswahl);
            p.email = curr.email.toLowerCase();
            p.wix_id = curr._id;
            p.wix_creation_date = new Date(curr.submissionTime);
            p.grade = curr.kopieVonFeldFurAufklappmenu;
            p.lastname = curr.kopieVonVorname;
            p.firstname = curr.firstName;

            pupils.push(p);
        }

        return pupils;
    } catch (e) {
        logger.error("Unexpected format of pupil api response: ", e.message);
        logger.debug(e);
    }

    return [];
}

export async function fetchFromWixToDb() {
    if (!init) {
        await initModule();
    }

    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    let count: number;

    // Fetch new students
    let latestFetchStudent = lastFetch; // Latest date, where we successfully fetched a new student
    let totalNewStudents = 0;
    do {
        logger.info("Fetching new students");
        count = 0;
        try {
            let newStudents = await getStudentsAfter(latestFetchStudent);
            for (let i = 0; i < newStudents.length; i++) {
                let student = newStudents[i];
                student.verification = generateToken();
                try {
                    // Note: Saving may fail and this is totally fine
                    // Possible reasons:
                    //   - A person tries to double-register (ie. duplicate email)
                    //   - The persons was already fetched (duplicate Wix id)
                    await entityManager.save(Student, student);
                    await transactionLog.log(new FetchedFromWixEvent(student));
                    totalNewStudents++;
                    await sendVerificationMail(student);
                    await transactionLog.log(
                        new VerificationRequestEvent(student)
                    );
                } catch (e) {
                    logger.debug("Can't save student: ", e.message);
                    logger.trace(e);
                }
                latestFetchStudent = new Date(
                    latestFetchStudent.getTime() >
                    student.wix_creation_date.getTime()
                        ? latestFetchStudent.getTime()
                        : student.wix_creation_date.getTime()
                );
                count++;
            }
        } catch (e) {
            logger.warn("Can't fetch and save latest students: ", e.message);
            logger.debug(e);
        }
    } while (count >= apiMaxResults);
    logger.info("Fetched " + totalNewStudents + " new students");

    // Fetch new pupils
    let latestFetchPupil = lastFetch;
    let totalNewPupils = 0;
    do {
        logger.info("Fetching new pupils");
        count = 0;

        try {
            let newPupils = await getPupilsAfter(latestFetchPupil);
            for (let i = 0; i < newPupils.length; i++) {
                let pupil = newPupils[i];
                pupil.verification = generateToken();
                try {
                    // Note: Saving may fail and this is totally fine
                    // Possible reasons:
                    //   - A person tries to double-register (ie. duplicate email)
                    //   - The persons was already fetched (duplicate Wix id)
                    await entityManager.save(Pupil, pupil);
                    await transactionLog.log(new FetchedFromWixEvent(pupil));
                    totalNewPupils++;
                    await sendVerificationMail(pupil);
                    await transactionLog.log(
                        new VerificationRequestEvent(pupil)
                    );
                } catch (e) {
                    logger.debug("Can't save pupil: ", e.message);
                    logger.trace(e);
                }
                latestFetchPupil = new Date(
                    latestFetchPupil.getTime() >
                    pupil.wix_creation_date.getTime()
                        ? latestFetchPupil.getTime()
                        : pupil.wix_creation_date.getTime()
                );
                count++;
            }
        } catch (e) {
            logger.warn("Can't fetch and save latest pupils: ", e.message);
            logger.debug(e);
        }
    } while (count >= apiMaxResults);
    logger.info("Fetched " + totalNewPupils + " new pupils");

    let lastFetchTime =
        latestFetchPupil.getTime() > latestFetchStudent.getTime()
            ? latestFetchPupil.getTime()
            : latestFetchStudent.getTime();
    lastFetch = new Date(lastFetchTime);
}

async function initModule() {
    try {
        const conn = getConnection();

        let x = await conn.query(
            "SELECT wix_creation_date AS latest_date FROM (" +
                "(SELECT wix_creation_date FROM pupil ORDER BY wix_creation_date DESC LIMIT 1) " +
                "UNION " +
                "(SELECT wix_creation_date FROM student ORDER BY wix_creation_date DESC LIMIT 1)" +
                ") t ORDER BY latest_date DESC LIMIT 1;"
        );

        if (x.length == 0) {
            lastFetch = new Date();
            logger.warn(
                "Can't get date of last fetch. Using now as last fetch date."
            );
        } else {
            lastFetch = new Date(x[0].latest_date);
            logger.info("Restored old last fetch date: ", lastFetch);
        }

        init = true;
    } catch (e) {
        logger.error("Can't initialize fetch module: ", e.message);
        logger.debug(e);
    }
}
