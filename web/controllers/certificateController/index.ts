import { getLogger } from 'log4js';
import { Request, Response } from 'express';
import { Pupil } from '../../../common/entity/Pupil';
import { Student } from '../../../common/entity/Student';
import { getTransactionLog } from '../../../common/transactionlog';
import { getManager } from 'typeorm';
import { Match } from '../../../common/entity/Match';
import { readFileSync, read } from 'fs';
import * as escape from 'escape-html';
import * as pdf from 'html-pdf';
import * as path from 'path';
import * as moment from "moment";
import CertificateRequestEvent from '../../../common/transactionlog/types/CertificateRequestEvent';
import { ParticipationCertificate } from '../../../common/entity/ParticipationCertificate';
import { randomBytes } from "crypto";
import { parseDomain, ParseResultType } from "parse-domain";
import { assert } from 'console';
import { Person } from '../../../common/entity/Person';

const logger = getLogger();

/**
 * @api {GET} /certificate/:student/:match getCertificate
 * @apiVersion 1.1.0
 * @apiDescription
 * Fetch a certificate
 *
 * This endpoint allows fetching a certificate (as PDF) with the second page customized for a pupil.
 * It is only available for students.
 *
 * @apiParam (URL Parameter) {string} student ID of the student
 * @apiParam (URL Parameter) {string} match UUID of the match
 *
 * @apiParam (Query Parameter) {number} endDate Unix Timestamp for the end date
 * @apiParam (Query Parameter) {string} subjects Must be a comma seperated string of the subjects. Only subjects that are matched are available
 * @apiParam (Query Parameter) {number} hoursPerWeek Hours per week helped
 * @apiParam (Query Parameter) {number} hoursTotal Total hours helped
 * @apiParam (Query Parameter) {string} medium Support medium
 * @apiParam (Query Parameter) {string} categories String of category texts for pupil's student description, separated by newlines
 *
 * @apiName getCertificate
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://api.corona-school.de/api/certificate/00000000-0000-0002-0001-1b4c4c526364/00000000-0000-0001-0001-1b4c4c526364
 *
 * @apiUse Authentication
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function certificateHandler(req: Request, res: Response) {
    const entityManager = getManager();

    try {
        if (
            req.params.student == undefined ||
            req.params.pupil == undefined ||
            !(res.locals.user instanceof Student || res.locals.user instanceof Pupil)
        ) return res.status(400).send("Missing parameters");

        const requestor = res.locals.user as Student;

        if (requestor instanceof Pupil)
            return res.status(403).send("Only students may request certificates");

        if (requestor.wix_id != req.params.student)
            return res.status(403).send("Students may only retrieve certificates for themselves");


        let params = {
            endDate: req.query.endDate as string || moment().format("X") as string,
            subjects: req.query.subjects as string,
            hoursPerWeek: Number.parseFloat(req.query.hoursPerWeek as string) || 0.0,
            hoursTotal: Number.parseFloat(req.query.hoursTotal as string) || 0.0,
            medium: req.query.medium as string,
            categories: req.query.categories as string
        };

        //parse hostname, to determine the base url which should be used for certificate links -> TODO: improve the link handling (with all that static links in various parts of the code...)
        const parseResult = parseDomain(req.hostname);
        let baseDomain = "corona-school.de"; //default
        if (parseResult.type === ParseResultType.Listed) {
            const { domain, topLevelDomains } = parseResult;
            baseDomain = [domain, ...topLevelDomains].join(".");
        }

        // Students may only request for their matches
        let match = await entityManager.findOne(Match, { student: requestor, uuid: req.params.pupil });
        if (match == undefined)
            return res.status(400).send(`No Match found with uuid ${req.params.pupil}`);

        const certificate = await createCertificate(requestor, match.pupil, match, params);

        const verificationLink = "http://verify." + baseDomain + "/" + certificate.uuid;

        const pdf = await createPDFBinary(certificate, verificationLink);

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length
        });
        return res.end(pdf);
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        return res.status(500).send("Internal server error");
    }
}


/**
 * @api {GET} /certificate/:certificateId getCertificateConfirmation
 * @apiVersion 1.1.0
 * @apiDescription
 * View a certificate
 *
 * This endpoint allows looking at a certificate (as HTML) as confirmation link printed on the PDF Certificate.
 *
 * @apiParam (URL Parameter) {string} certificateId UUID of the certificate
 *
 * @apiName getCertificate
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://api.corona-school.de/api/certificate/000000001-0000-0000-0701-1b4c4c526384
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function confirmCertificateHandler(req: Request, res: Response) {
    try {
        const { certificateId } = req.params;
        const entityManager = getManager();

        if (typeof certificateId !== "string")
            return res.status(400).send("Missing parameter certificateId");

        const certificate = await entityManager.findOne(ParticipationCertificate, { uuid: certificateId.toUpperCase() }, { relations: ["student", "pupil"] });

        if (!certificate)
            return res.status(404).send("<h1>Zertifikatslink nicht valide.</h1>");


        return res.send(await viewParticipationCertificate(certificate));
    } catch (error) {
        logger.error("Failed to generate certificate confirmation", error);
        return res.status(500).send("<h1>Ein Fehler ist aufgetreten... 😔</h1>");
    }
}

/**
 * @api {GET} /certificates
 * @apiVersion 1.1.0
 * @apiDescription
 * View certificate data
 *
 * Returns data for certificates requested by the user or to be approved by the user (either student = user or pupil = user)
 *
 *
 * @apiName getCertificates
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://api.corona-school.de/api/certificates
 *
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 *
 * @typedef {Object} Response
 * @property {Array} certificates
 *
 * @returns {Response}
 */
export async function getCertificates(req: Request, res: Response) {
    const entityManager = getManager();

    assert(res.locals.user, "No user set");

    const userid = (res.locals.user as Person).id;

    try {
        const certificatesData = await entityManager.find(ParticipationCertificate, { where: [{ pupil: userid }, /*or*/ { student: userid }], relations: ["student", "pupil"] });
        const certificates = certificatesData.map(cert => exposeCertificate(cert, /*to*/ res.locals.user));
        return res.json({ certificates });
    } catch (error) {
        logger.error("Retrieving certificates for user failed with", error);
        return res.status(500).send("Internal Server error");
    }
}

interface IExposedCertificate {
    userIs: "pupil" | "student",
    pupil: { firstname: string, lastname: string },
    student: { firstname: string, lastname: string },
    subjects: string,
    categories: string,
    certificateDate: Date,
    startDate: Date,
    endDate: Date,
    uuid: string,
    hoursPerWeek: number,
    hoursTotal: number,
    medium: string,
}

/* Map the certificate data to something the frontend can work with while keeping user data secret */
function exposeCertificate({ student, pupil, ...cert }: ParticipationCertificate, to: Student | Pupil): IExposedCertificate {
    return {
        ...cert,
        // NOTE: user.id is NOT unique, as Students and Pupils can have the same id
        userIs: pupil.wix_id === to.wix_id ? "pupil" : "student",
        pupil: { firstname: pupil.firstname, lastname: pupil.lastname },
        student: { firstname: student.firstname, lastname: student.lastname }
    };
}

interface IParams {
    endDate: string,
    subjects: string,
    hoursPerWeek: number,
    hoursTotal: number,
    medium: string,
    categories: string
}

async function createCertificate(requestor: Student, pupil: Pupil, match: Match, params: IParams): Promise<ParticipationCertificate> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    let pc = new ParticipationCertificate();
    pc.pupil = pupil;
    pc.student = requestor;
    pc.subjects = params.subjects;
    pc.categories = params.categories;
    pc.hoursPerWeek = params.hoursPerWeek;
    pc.hoursTotal = params.hoursTotal;
    pc.medium = params.medium;
    pc.startDate = match.createdAt;
    pc.endDate = moment(params.endDate, "X").toDate();

    do {
        pc.uuid = randomBytes(5).toString('hex').toUpperCase();
    } while (await entityManager.findOne(ParticipationCertificate, { uuid: pc.uuid }));

    await entityManager.save(ParticipationCertificate, pc);
    await transactionLog.log(new CertificateRequestEvent(requestor, match.uuid));

    return pc;
}

const englishTemplate = readFileSync("./assets/certificateTemplate.html", "utf8");

function createPDFBinary(certificate: ParticipationCertificate, link: string): Promise<Buffer> {
    const { student, pupil } = certificate;

    // TODO: Load different language templates
    const template = englishTemplate;

    const options = {
        "base": "file://" + path.resolve(__dirname + "/../../../../assets") + "/",
        "filename": "/tmp/html-pdf-" + student.id + "-" + pupil.id + "-" + moment().format("X") + ".pdf"
    };

    // adjust variables
    // todo for 2021: replace %TPL% by <TPL>
    const result = template
        .replace(/%NAMESTUDENT%/g, escape(student.firstname + " " + student.lastname))
        .replace(/%NAMESCHUELER%/g, escape(pupil.firstname + " " + pupil.lastname))
        .replace("%DATUMHEUTE%", moment().format("D.M.YYYY"))
        .replace("%SCHUELERSTART%", moment(certificate.startDate, "X").format("D.M.YYYY"))
        .replace("%SCHUELERENDE%", moment(certificate.endDate, "X").format("D.M.YYYY"))
        .replace("%SCHUELERFAECHER%", escape(certificate.subjects).replace(/,/g, ", "))
        .replace("%SCHUELERFREITEXT%", escape(certificate.categories).replace(/(?:\r\n|\r|\n)/g, '<br />'))
        .replace("%SCHUELERPROWOCHE%", escape(certificate.hoursPerWeek))
        .replace("%SCHUELERGESAMT%", escape(certificate.hoursTotal))
        .replace("%MEDIUM%", escape(certificate.medium))
        .replace("%CERTLINK%", link)
        .replace("%CERTLINKTEXT%", link);

    // pdf.create(html, options).toFile("./assets/debug.pdf", (err, res) => { console.log(res)});

    return new Promise((resolve, reject) => {
        pdf.create(result, options).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
}

const englishVerificationTemplate = readFileSync("./assets/verifiedCertificatePage.html", "utf8");

async function viewParticipationCertificate(certificate: ParticipationCertificate) {
    let verificationTemplate = englishVerificationTemplate;

    const screeningDate = (await certificate.student?.screening)?.createdAt;

    return verificationTemplate
        .replace(/%NAMESTUDENT%/g, escape(certificate.student?.firstname + " " + certificate.student?.lastname))
        .replace(/%NAMESCHUELER%/g, escape(certificate.pupil?.firstname + " " + certificate.pupil?.lastname))
        .replace("%DATUMHEUTE%", moment(certificate.certificateDate).format("D.M.YYYY"))
        .replace("%SCHUELERSTART%", moment(certificate.startDate).format("D.M.YYYY"))
        .replace("%SCHUELERENDE%", moment(certificate.endDate).format("D.M.YYYY"))
        .replace("%SCHUELERFAECHER%", escape(certificate.subjects).replace(/,/g, ", "))
        .replace("%SCHUELERFREITEXT%", escape(certificate.categories).replace(/(?:\r\n|\r|\n)/g, '<br />'))
        .replace("%SCHUELERPROWOCHE%", escape(certificate.hoursPerWeek))
        .replace("%SCHUELERGESAMT%", escape(certificate.hoursTotal))
        .replace("%MEDIUM%", escape(certificate.medium))
        .replace("%SCREENINGDATUM%", escape(screeningDate ? moment(screeningDate).format("D.M.YYYY") : "[UNBEKANNTES DATUM]"));
}
