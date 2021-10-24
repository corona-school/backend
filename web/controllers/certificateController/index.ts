import { getLogger } from 'log4js';
import { Request, Response } from 'express';
import { Pupil } from '../../../common/entity/Pupil';
import { Student } from '../../../common/entity/Student';
import { getTransactionLog } from '../../../common/transactionlog';
import { getManager } from 'typeorm';
import { Match } from '../../../common/entity/Match';
import { readFileSync, existsSync } from 'fs';
import { generatePDFFromHTMLString } from 'html-pppdf';
import path from 'path';
import moment from "moment";
import CertificateRequestEvent from '../../../common/transactionlog/types/CertificateRequestEvent';
import { ParticipationCertificate } from '../../../common/entity/ParticipationCertificate';
import { randomBytes } from "crypto";
import { parseDomain, ParseResultType } from "parse-domain";
import { assert } from 'console';
import { Person } from '../../../common/entity/Person';
import EJS from "ejs";
import { mailjetTemplates, sendTemplateMail } from '../../../common/mails';
import { createAutoLoginLink } from '../utils';
import * as Notification from "../../../common/notification";
import { createRemissionRequestPDF } from "../../../common/remission-request";

const logger = getLogger();

// supported certificate languages:
const LANGUAGES = ["de", "en"] as const;
type Language = (typeof LANGUAGES)[number];
const DefaultLanguage = "de";

const MEDIUMS = ['Video-Chat', 'E-Mail', 'Telefon', 'Chat-Nachrichten'] as const;

/**
 * @api {POST} /certificate/create getCertificate
 * @apiVersion 1.1.0
 * @apiDescription
 * Create a certificate
 *
 * It is only available for students.
 *
 * @apiParam (JSON Body) {string} pupil UUID of the pupil
 * @apiParam (JSON body) {number} endDate Unix Timestamp for the end date
 * @apiParam (JSON body) {string} subjects Must be a comma seperated string of the subjects. Only subjects that are matched are available
 * @apiParam (JSON body) {number} hoursPerWeek Hours per week helped
 * @apiParam (JSON body) {number} hoursTotal Total hours helped
 * @apiParam (JSON body) {string} medium Support medium
 * @apiParam (JSON body) {string} categories String of category texts for pupil's student description, separated by newlines
 * @apiParam (JSON body) {string} automatic if set, the pupil will automatically receive a signature request
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
export async function createCertificateEndpoint(req: Request, res: Response) {
    const entityManager = getManager();

    try {
        assert(res.locals.user, "Must be logged in");

        const { pupil, automatic, endDate, subjects, hoursPerWeek, hoursTotal, medium, activities, ongoingLessons } = req.body;
        const requestor = res.locals.user as Student;

        if (requestor instanceof Pupil) {
            return res.status(403).send("Only students may request certificates");
        }

        if (!pupil || !endDate || !subjects || hoursPerWeek === undefined || hoursTotal === undefined || !medium || !activities) {
            return res.status(400).send("Missing parameters");
        }

        if (automatic !== undefined && typeof automatic !== "boolean") {
            return res.status(400).send("automatic must be boolean");
        }

        if (typeof endDate !== "number") {
            return res.status(400).send("endDate must be a number");
        }

        if (!Array.isArray(subjects) || subjects.some(it => typeof it !== "string")) {
            return res.status(400).send("subjects must be an array of strings");
        }

        if (typeof hoursPerWeek !== "number" || hoursPerWeek < 0) {
            return res.status(400).send("hoursPerWeek must be a positive number");
        }

        if (typeof hoursTotal !== "number" || hoursTotal < 0) {
            return res.status(400).send("hoursTotal must be a positive number");
        }

        if (!MEDIUMS.includes(medium)) {
            return res.status(400).send(`medium must be one of ${MEDIUMS}`);
        }

        if (!Array.isArray(activities) || activities.some(it => typeof it !== "string")) {
            return res.status(400).send("categories must be an array of strings");
        }

        if (ongoingLessons !== undefined && typeof ongoingLessons !== "boolean") {
            return res.status(400).send("ongoingLessons must be boolean");
        }

        let state = automatic ? State.awaitingApproval : State.manual;

        let params: IParams = {
            endDate,
            subjects: subjects.join(","),
            hoursPerWeek,
            hoursTotal,
            medium,
            activities: activities.join("\n"),
            ongoingLessons,
            state
        };

        // Students may only request for their matches
        let match = await entityManager.findOne(Match, { student: requestor, uuid: pupil });
        if (match == undefined) {
            return res.status(400).send(`No Match found with uuid '${pupil}'`);
        }

        const certificate = await createCertificate(requestor, match.pupil, match, params);

        return res.json({ uuid: certificate.uuid, automatic });
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        return res.status(500).send("Internal server error");
    }
}


/**
 * @api {GET} /certificate/:certificateId?lang=... getCertificateConfirmation
 * @apiVersion 1.1.0
 * @apiDescription
 * View a certificate
 *
 * Returns the certificate as PDF
 *
 * @apiParam (URL Parameter) {string} certificateId UUID of the certificate
 * @apiParam (URL Query)     {string} lang=de The language
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
export async function getCertificateEndpoint(req: Request, res: Response) {
    try {
        const { certificateId } = req.params;
        let { lang } = req.query;
        const requestor = res.locals.user as Student;
        assert(requestor, "No user set");

        const entityManager = getManager();

        if (lang === undefined) {
            lang = DefaultLanguage;
        }

        if (!LANGUAGES.includes(lang as Language)) {
            return res.status(400).send("Language not known");
        }

        if (typeof certificateId !== "string") {
            return res.status(400).send("Missing parameter certificateId");
        }

        /* Retrieve the certificate and also get the signature columsn that are usually hidden for performance reasons */
        const certificate = await entityManager.findOne(ParticipationCertificate, { uuid: certificateId.toUpperCase(), student: requestor }, {
            relations: ["student", "pupil"],
            /* Unfortunately there is no "*" option which would also select the signatures. The query builder also does not cover this case */
            select: ["uuid", "categories", "certificateDate", "endDate", "hoursPerWeek", "hoursTotal", "id", "medium", "ongoingLessons", "signatureParent", "signaturePupil", "signatureDate", "signatureLocation", "startDate", "state", "subjects"]
        });

        if (!certificate) {
            return res.status(404).send("<h1>Zertifikatslink nicht valide.</h1>");
        }

        const pdf = await createPDFBinary(
            certificate,
            getCertificateLink(req, certificate, lang as Language),
            lang as Language
        );

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length
        });
        return res.end(pdf);
    } catch (error) {
        logger.error("Failed to generate certificate confirmation", error);
        return res.status(500).send("<h1>Ein Fehler ist aufgetreten... 😔</h1>");
    }
}

/**
 * @api {GET} /certificate/:certificateId/confirmation?lang=... getCertificateConfirmation
 * @apiVersion 1.1.0
 * @apiDescription
 * View a certificate
 *
 * This endpoint allows looking at a certificate (as HTML) as confirmation link printed on the PDF Certificate.
 *
 * @apiParam (URL Parameter) {string} certificateId UUID of the certificate
 * @apiParam (URL Query)     {string} lang=de The language
 *
 * @apiName getCertificate
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://api.corona-school.de/api/certificate/000000001-0000-0000-0701-1b4c4c526384/confirmation
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getCertificateConfirmationEndpoint(req: Request, res: Response) {
    try {
        const { certificateId } = req.params;
        let { lang } = req.query;

        const entityManager = getManager();

        if (lang === undefined) {
            lang = DefaultLanguage;
        }

        if (!LANGUAGES.includes(lang as Language)) {
            return res.status(400).send("Language not known");
        }

        if (typeof certificateId !== "string") {
            return res.status(400).send("Missing parameter certificateId");
        }

        const certificate = await entityManager.findOne(ParticipationCertificate, { uuid: certificateId.toUpperCase() }, { relations: ["student", "pupil"] });

        if (!certificate) {
            return res.status(404).send("<h1>Zertifikatslink nicht valide.</h1>");
        }


        return res.send(await viewParticipationCertificate(certificate, lang as Language));
    } catch (error) {
        logger.error("Failed to generate certificate confirmation", error);
        return res.status(500).send("<h1>Ein Fehler ist aufgetreten... 😔</h1>");
    }
}

const VALID_BASE64 = /^data\:image\/(png|jpeg)\;base64\,([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/g;

/**
 * @api {POST} /certificate/:certificateId/sign
 * @apiVersion 1.1.0
 * @apiDescription
 * Sign a signature in the automatic signature approval process
 *
 * @apiParam (JSON Body) {string} signaturePupil  The signature of the pupil encoded as base64 JPG. Either the pupil or the parent signature must be set.
 * @apiParam (JSON Body) {string} signatureParent The signature of the parent encoded as base64 JPG.
 * @apiName signCertificate
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST https://api.corona-school.de/api/certificate/000000001-0000-0000-0701-1b4c4c526384/sign
 *
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 *
 *
 */
export async function signCertificateEndpoint(req: Request, res: Response) {
    const signer = res.locals.user as Pupil;
    const { signaturePupil, signatureParent, signatureLocation } = req.body;
    const { certificateId } = req.params;

    const entityManager = getManager();

    if (typeof certificateId !== "string") {
        return res.status(400).send("Missing parameter certificateId");
    }

    if (signaturePupil !== undefined && (typeof signaturePupil !== "string" || !signaturePupil.match(VALID_BASE64))) {
        return res.status(400).send("Parameter signaturePupil must be a string and valid base64 encoding");
    }

    if (signatureParent !== undefined && (typeof signatureParent !== "string" || !signatureParent.match(VALID_BASE64))) {
        return res.status(400).send("Parameter signatureParent must be a string and valid base64 encoding");
    }

    if (!signaturePupil && !signatureParent) {
        return res.status(400).send("Either the parent or the pupil must sign the certificate");
    }

    if (typeof signatureLocation !== "string" || !signatureLocation) {
        return res.status(400).send("Parameter signatureLocation must be a string");
    }

    const certificate = await entityManager.findOne(ParticipationCertificate, { pupil: signer, uuid: certificateId.toUpperCase() }, { relations: ["student", "pupil"] });

    if (!certificate) {
        return res.status(400).send("Missing certificateID or the pupil is not allowed to sign this certificate");
    }

    if (certificate.state === "approved") {
        return res.status(400).send("Certificate was already signed");
    }

    if (certificate.state === "manual") {
        return res.status(400).send("Certificate cannot be signed as it is a manual one");
    }

    try {
        await signCertificate(req, certificate, signatureParent, signaturePupil, signatureLocation);
        return res.send("Certificate signed");
    } catch (error) {
        logger.error("Failed to sign certificate", error);
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
export async function getCertificatesEndpoint(req: Request, res: Response) {
    const entityManager = getManager();

    assert(res.locals.user, "No user set");

    const userid = (res.locals.user as Person).id;

    try {
        const certificatesData = await entityManager.find(ParticipationCertificate, {
            where: res.locals.user instanceof Pupil ? { pupil: userid } : { student: userid },
            relations: ["student", "pupil"]
        });
        const certificates = certificatesData.map(cert => exposeCertificate(cert, /*to*/ res.locals.user));
        return res.json({ certificates });
    } catch (error) {
        logger.error("Retrieving certificates for user failed with", error);
        return res.status(500).send("Internal Server error");
    }
}

export async function getRemissionRequestEndpoint(req: Request, res: Response) {
    const student = res.locals.user as Student;

    if (!student.active) {
        return res.status(403).send("Non-active students are not entitled to remission requests.");
    }

    try {
        const pdf = await createRemissionRequestPDF(student);

        if (pdf === undefined) {
            return res.status(404).send("Could not find a remission request for this user.");
        }

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length
        });

        return res.end(pdf);
    } catch (error) {
        logger.error("Generating remission request failed with: ", error);
        return res.status(500).send("<h1>Ein Fehler ist aufgetreten... 😔</h1>");
    }
}

enum State {
    manual = "manual", // student did not request approval
    awaitingApproval = "awaiting-approval", // pupil needs to sign certificate
    approved = "approved" // signed by pupil
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
    state: State,
}

/* Map the certificate data to something the frontend can work with while keeping user data secret */
function exposeCertificate({ student, pupil, state, ...cert }: ParticipationCertificate, to: Student | Pupil): IExposedCertificate {
    return {
        ...cert,
        // NOTE: user.id is NOT unique, as Students and Pupils can have the same id
        userIs: pupil.wix_id === to.wix_id ? "pupil" : "student",
        pupil: { firstname: pupil.firstname, lastname: pupil.lastname },
        student: { firstname: student.firstname, lastname: student.lastname },
        state: state as State
    };
}


interface IParams {
    endDate: number,
    subjects: string,
    hoursPerWeek: number,
    hoursTotal: number,
    medium: string,
    activities: string,
    ongoingLessons: boolean,
    state: State.manual | State.awaitingApproval
}

async function createCertificate(requestor: Student, pupil: Pupil, match: Match, params: IParams): Promise<ParticipationCertificate> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    let pc = new ParticipationCertificate();
    pc.pupil = pupil;
    pc.student = requestor;
    pc.subjects = params.subjects;
    pc.categories = params.activities;
    pc.hoursPerWeek = params.hoursPerWeek;
    pc.hoursTotal = params.hoursTotal;
    pc.medium = params.medium;
    pc.startDate = match.createdAt;
    pc.endDate = moment(params.endDate, "X").toDate();
    pc.ongoingLessons = params.ongoingLessons;
    pc.state = params.state;

    do {
        pc.uuid = randomBytes(5).toString('hex')
            .toUpperCase();
    } while (await entityManager.findOne(ParticipationCertificate, { uuid: pc.uuid }));

    await entityManager.save(ParticipationCertificate, pc);
    await transactionLog.log(new CertificateRequestEvent(requestor, match.uuid));

    if (params.state === "awaiting-approval") {
        const certificateLink = createAutoLoginLink(pc.pupil, `/settings?sign=${pc.uuid}`);
        const mail = mailjetTemplates.CERTIFICATEREQUEST({
            certificateLink,
            pupilFirstname: pc.pupil.firstname,
            studentFirstname: pc.student.firstname
        });
        await sendTemplateMail(mail, pc.pupil.email);
        await Notification.actionTaken(pc.pupil, "pupil_certificate_approval", {
            uniqueId: `${pc.id}`,
            certificateLink,
            student: pc.student });
    }

    return pc;
}

const _templates: { [name: string]: { [key in Language | "default"]?: EJS.ClientFunction } } = {};

/* Loads the template from the /assets folder, falls back to the default language if fallback is true */
function loadTemplate(name, lang: Language, fallback: boolean = true): EJS.ClientFunction {
    if (_templates[name] && _templates[name][lang]) {
        return _templates[name][lang];
    }

    let path = `./assets/${name}.${lang}.html`;

    if (existsSync(path)) {
        const result = readFileSync(path, "utf8");
        if (!_templates[name]) {
            _templates[name] = {};
        }

        const compiled = EJS.compile(result);

        _templates[name][lang] = compiled;
        return compiled;
    } else {
        if (!fallback || lang === DefaultLanguage) {
            throw new Error(`Cannot find template '${path}`);
        }

        return loadTemplate(name, DefaultLanguage, /*fallback:*/ false);
    }
}

function getCertificateLink(req: Request, certificate: ParticipationCertificate, lang: Language) {
    //parse hostname, to determine the base url which should be used for certificate links -> TODO: improve the link handling (with all that static links in various parts of the code...)
    const parseResult = parseDomain(req.hostname);
    let baseDomain = "corona-school.de"; //default
    if (parseResult.type === ParseResultType.Listed) {
        const { domain, topLevelDomains } = parseResult;
        baseDomain = [domain, ...topLevelDomains].join(".");
    }

    return "http://verify." + baseDomain + "/" + certificate.uuid + "?lang=" + lang;
}

async function createPDFBinary(certificate: ParticipationCertificate, link: string, lang: Language): Promise<Buffer> {
    const { student, pupil } = certificate;

    const template = loadTemplate("certificateTemplate", lang);

    let name = student.firstname + " " + student.lastname;

    if (process.env.ENV == 'dev') {
        name = `[TEST] ${name}`;
    }

    const result = template({
        NAMESTUDENT: name,
        NAMESCHUELER: pupil.firstname + " " + pupil.lastname,
        DATUMHEUTE: moment().format("D.M.YYYY"),
        SCHUELERSTART: moment(certificate.startDate, "X").format("D.M.YYYY"),
        SCHUELERENDE: moment(certificate.endDate, "X").format("D.M.YYYY"),
        SCHUELERFAECHER: certificate.subjects.split(","),
        SCHUELERFREITEXT: certificate.categories.split(/(?:\r\n|\r|\n)/g),
        SCHUELERPROWOCHE: certificate.hoursPerWeek,
        SCHUELERGESAMT: certificate.hoursTotal,
        MEDIUM: certificate.medium,
        CERTLINK: link,
        CERTLINKTEXT: link,
        ONGOING: certificate.ongoingLessons,
        SIGNATURE_PARENT: certificate.signatureParent?.toString("utf-8"),
        SIGNATURE_PUPIL: certificate.signaturePupil?.toString("utf-8"),
        SIGNATURE_LOCATION: certificate.signatureLocation,
        SIGNATURE_DATE: certificate.signatureDate && moment(certificate.signatureDate).format("D.M.YYYY")
    });

    const ASSETS = __dirname + "/../../../../assets";
    return await generatePDFFromHTMLString(result, {
        includePaths: [
            path.resolve(ASSETS)
        ]
    });
}

async function viewParticipationCertificate(certificate: ParticipationCertificate, lang: Language) {
    let verificationTemplate = loadTemplate("verifiedCertificatePage", lang);

    const screeningDate = (await certificate.student?.screening)?.createdAt;

    return verificationTemplate({
        NAMESTUDENT: certificate.student?.firstname + " " + certificate.student?.lastname,
        NAMESCHUELER: certificate.pupil?.firstname + " " + certificate.pupil?.lastname,
        DATUMHEUTE: moment(certificate.certificateDate).format("D.M.YYYY"),
        SCHUELERSTART: moment(certificate.startDate).format("D.M.YYYY"),
        SCHUELERENDE: moment(certificate.endDate).format("D.M.YYYY"),
        SCHUELERFAECHER: certificate.subjects.split(","),
        SCHUELERFREITEXT: certificate.categories.split(/(?:\r\n|\r|\n)/g),
        SCHUELERPROWOCHE: certificate.hoursPerWeek,
        SCHUELERGESAMT: certificate.hoursTotal,
        MEDIUM: certificate.medium,
        SCREENINGDATUM: screeningDate ? moment(screeningDate).format("D.M.YYYY") : "[UNBEKANNTES DATUM]",
        ONGOING: certificate.ongoingLessons
    });
}

async function signCertificate(req: Request, certificate: ParticipationCertificate, signatureParent: string | undefined, signaturePupil: string | undefined, signatureLocation: string) {
    assert(signaturePupil || signatureParent, "Parent or Pupil signs certificate");
    assert(!signaturePupil || signaturePupil.match(VALID_BASE64), "Pupil Signature is valid Base 64");
    assert(!signatureParent || signatureParent.match(VALID_BASE64), "Parent Signature is valid Base 64");
    assert(certificate.state === "awaiting-approval", "Certificate awaiting signature");
    assert(signatureLocation, "Singature location must be set");

    if (signatureParent) {
        certificate.signatureParent = Buffer.from(signatureParent, "utf-8");
    }

    if (signaturePupil) {
        certificate.signaturePupil = Buffer.from(signaturePupil, "utf-8");
    }

    certificate.signatureDate = new Date();
    certificate.signatureLocation = signatureLocation;
    certificate.state = "approved";

    await getManager().save(ParticipationCertificate, certificate);

    const rendered = await createPDFBinary(certificate, getCertificateLink(req, certificate, "de"), "de");

    const certificateLink = createAutoLoginLink(certificate.student, `/settings`);
    const mail = mailjetTemplates.CERTIFICATESIGNED({
        certificateLink,
        pupilFirstname: certificate.pupil.firstname,
        studentFirstname: certificate.student.firstname
    }, rendered.toString("base64"));
    await sendTemplateMail(mail, certificate.student.email);
    await Notification.actionTaken(certificate.student, "student_certificate_sign", {
        uniqueId: `${certificate.id}`,
        certificateLink,
        pupil: certificate.pupil
    });

}
