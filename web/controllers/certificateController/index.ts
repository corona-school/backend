import { getLogger } from 'log4js';
import { Request, Response } from 'express';
import { Pupil } from '../../../common/entity/Pupil';
import { Student } from '../../../common/entity/Student';
import { getTransactionLog } from '../../../common/transactionlog';
import { getManager, getRepository } from 'typeorm';
import { Match } from '../../../common/entity/Match';
import { readFileSync, existsSync } from 'fs';
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
import * as EJS from "ejs";
import { mailjetTemplates, sendTemplateMail } from '../../../common/mails';


const logger = getLogger();

// supported certificate languages:
const LANGUAGES = ["de", "en"] as const;
type Language = (typeof LANGUAGES)[number];
const DefaultLanguage = "de";

/**
 * @api {GET} /certificate/create/:student/:match getCertificate
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
 * @apiParam (Query Parameter) {string} automatic if set, the pupil will automatically receive a signature request
 *
 * @apiParam (URL Query)     {string} lang=de The language
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
        if (
            req.params.student == undefined ||
            req.params.pupil == undefined ||
            !(res.locals.user instanceof Student || res.locals.user instanceof Pupil)
        ) return res.status(400).send("Missing parameters");

        let lang = req.query.lang as Language;

        if (lang === undefined)
            lang = DefaultLanguage;

        if (!LANGUAGES.includes(lang))
            return res.status(400).send("Language not known");

        const requestor = res.locals.user as Student;

        if (requestor instanceof Pupil)
            return res.status(403).send("Only students may request certificates");

        if (requestor.wix_id != req.params.student)
            return res.status(403).send("Students may only retrieve certificates for themselves");

        let state = req.params.automatic ? State.awaitingApproval : State.manual;

        // TODO: Move to POST to body
        // TODO: Properly validate
        let params: IParams = {
            endDate: req.query.endDate as string || moment().format("X") as string,
            subjects: req.query.subjects as string,
            hoursPerWeek: Number.parseFloat(req.query.hoursPerWeek as string) || 0.0,
            hoursTotal: Number.parseFloat(req.query.hoursTotal as string) || 0.0,
            medium: req.query.medium as string,
            categories: req.query.categories as string,
            ongoingLessons: req.query.ongoingLessons === 'true',
            state
        };

        // Students may only request for their matches
        let match = await entityManager.findOne(Match, { student: requestor, uuid: req.params.pupil });
        if (match == undefined)
            return res.status(400).send(`No Match found with uuid ${req.params.pupil}`);

        const certificate = await createCertificate(requestor, match.pupil, match, params);

        const pdf = await createPDFBinary(certificate, getCertificateLink(req, certificate, lang), lang);

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

        if (lang === undefined)
            lang = DefaultLanguage;

        if (!LANGUAGES.includes(lang))
            return res.status(400).send("Language not known");

        if (typeof certificateId !== "string")
            return res.status(400).send("Missing parameter certificateId");

        /* Retrieve the certificate and also get the signature columsn that are usually hidden for performance reasons */
        const certificate = await entityManager.findOne(ParticipationCertificate, { uuid: certificateId.toUpperCase(), student: requestor }, {
            relations: ["student", "pupil"],
            /* Unfortunately there is no "*" option which would also select the signatures. The query builder also does not cover this case */
            select: ["uuid", "categories", "certificateDate", "endDate", "hoursPerWeek", "hoursTotal", "id", "medium", "ongoingLessons", "signatureParent", "signaturePupil", "startDate", "state", "subjects", "uuid"]
        });

        if (!certificate)
            return res.status(404).send("<h1>Zertifikatslink nicht valide.</h1>");

        const pdf = await createPDFBinary(certificate, getCertificateLink(req, certificate, lang), lang);

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

        if (lang === undefined)
            lang = DefaultLanguage;

        if (!LANGUAGES.includes(lang))
            return res.status(400).send("Language not known");

        if (typeof certificateId !== "string")
            return res.status(400).send("Missing parameter certificateId");

        const certificate = await entityManager.findOne(ParticipationCertificate, { uuid: certificateId.toUpperCase() }, { relations: ["student", "pupil"] });

        if (!certificate)
            return res.status(404).send("<h1>Zertifikatslink nicht valide.</h1>");


        return res.send(await viewParticipationCertificate(certificate, lang));
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
    const { signaturePupil, signatureParent } = req.body;
    const { certificateId } = req.params;

    const entityManager = getManager();

    if (typeof certificateId !== "string")
        return res.status(400).send("Missing parameter certificateId");

    if (signaturePupil !== undefined && (typeof signaturePupil !== "string" || !signaturePupil.match(VALID_BASE64)))
        return res.status(400).send("Parameter signaturePupil must be a string and valid base64 encoding");

    if (signatureParent !== undefined && (typeof signatureParent !== "string" || !signatureParent.match(VALID_BASE64)))
        return res.status(400).send("Parameter signatureParent must be a string and valid base64 encoding");

    if (!signaturePupil && !signatureParent)
        return res.status(400).send("Either the parent or the pupil must sign the certificate");

    const certificate = await entityManager.findOne(ParticipationCertificate, { pupil: signer, uuid: certificateId.toUpperCase() }, { relations: ["student", "pupil"] });

    if (!certificate)
        return res.status(400).send("Missing certificateID or the pupil is not allowed to sign this certificate");

    if (certificate.state === "approved")
        return res.status(400).send("Certificate was already signed");

    if (certificate.state === "manual")
        return res.status(400).send("Certificate cannot be signed as it is a manual one");

    await signCertificate(certificate, signatureParent, signaturePupil);

    return res.send("Certificate signed");
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
    endDate: string,
    subjects: string,
    hoursPerWeek: number,
    hoursTotal: number,
    medium: string,
    categories: string,
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
    pc.categories = params.categories;
    pc.hoursPerWeek = params.hoursPerWeek;
    pc.hoursTotal = params.hoursTotal;
    pc.medium = params.medium;
    pc.startDate = match.createdAt;
    pc.endDate = moment(params.endDate, "X").toDate();
    pc.ongoingLessons = params.ongoingLessons;
    pc.state = params.state;

    do {
        pc.uuid = randomBytes(5).toString('hex').toUpperCase();
    } while (await entityManager.findOne(ParticipationCertificate, { uuid: pc.uuid }));

    await entityManager.save(ParticipationCertificate, pc);
    await transactionLog.log(new CertificateRequestEvent(requestor, match.uuid));

    if (params.state === "awaiting-approval") {
        // TODO: Send Email
        // sendTemplateMail(mailjetTemplates.PUPILSIGNREQUEST, certificate.pupil.email);
    }

    return pc;
}

const _templates: { [name: string]: { [key in Language | "default"]?: EJS.ClientFunction } } = {};

/* Loads the template from the /assets folder, falls back to the default language if fallback is true */
function loadTemplate(name, lang: Language, fallback: boolean = true): EJS.ClientFunction {
    if (_templates[name] && _templates[name][lang])
        return _templates[name][lang];

    let path = `./assets/${name}.${lang}.html`;

    if (process.env.NODE_ENV == 'dev')
        path += `.example`;

    if (existsSync(path)) {
        const result = readFileSync(path, "utf8");
        if (!_templates[name])
            _templates[name] = {};

        const compiled = EJS.compile(result);

        _templates[name][lang] = compiled;
        return compiled;
    } else {
        if (!fallback || lang === DefaultLanguage)
            throw new Error(`Cannot find template '${path}`);

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

function createPDFBinary(certificate: ParticipationCertificate, link: string, lang: Language): Promise<Buffer> {
    const { student, pupil } = certificate;

    // TODO: Load different language templates
    const template = loadTemplate("certificateTemplate", lang);

    const options = {
        "base": "file://" + path.resolve(__dirname + "/../../../../assets") + "/",
        "filename": "/tmp/html-pdf-" + student.id + "-" + pupil.id + "-" + moment().format("X") + ".pdf"
    };


    const result = template({
        NAMESTUDENT: student.firstname + " " + student.lastname,
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
        SIGNATURE_PARENT: certificate.signatureParent && certificate.signatureParent.toString("utf-8"),
        SIGNATURE_PUPIL: certificate.signaturePupil && certificate.signaturePupil.toString("utf-8")
    });

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

async function signCertificate(certificate: ParticipationCertificate, signatureParent: string | undefined, signaturePupil: string | undefined) {
    assert(signaturePupil || signatureParent, "Parent or Pupil signs certificate");
    assert(!signaturePupil || signaturePupil.match(VALID_BASE64), "Pupil Signature is valid Base 64");
    assert(!signatureParent || signatureParent.match(VALID_BASE64), "Parent Signature is valid Base 64");
    assert(certificate.state === "awaiting-approval", "Certificate awaiting signature");

    if (signatureParent)
        certificate.signatureParent = Buffer.from(signatureParent, "utf-8");

    if (signaturePupil)
        certificate.signaturePupil = Buffer.from(signaturePupil, "utf-8");

    certificate.state === "approved";

    await getManager().save(ParticipationCertificate, certificate);

    // TODO: Send Email to certificate.student
    // sendTemplateMail(mailjetTemplates.STUDENTSIGNEDCERT, certificate.student.email);
}
