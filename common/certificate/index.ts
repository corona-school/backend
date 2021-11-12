
import { readFileSync, existsSync } from 'fs';
import { generatePDFFromHTMLString } from 'html-pppdf';
import path from 'path';
import moment from "moment";
import CertificateRequestEvent from '../transactionlog/types/CertificateRequestEvent';
import { getTransactionLog } from '../transactionlog';
import { randomBytes } from "crypto";
import EJS from "ejs";
import { mailjetTemplates, sendTemplateMail } from '../mails';
import { createAutoLoginLink } from '../../web/controllers/utils';
import * as Notification from "../notification";
import { Pupil } from '../entity/Pupil';
import { Student } from '../entity/Student';
import { pupil as PrismaPupil, student as PrismaStudent } from "@prisma/client";
import { getManager } from 'typeorm';
import { Match } from '../entity/Match';
import { ParticipationCertificate } from '..//entity/ParticipationCertificate';
import assert from 'assert';

// TODO: Replace TypeORM operations with Prisma

export const VALID_BASE64 = /^data\:image\/(png|jpeg)\;base64\,([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/g;

// supported certificate languages:
export const LANGUAGES = ["de", "en"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DefaultLanguage = "de";


export const CERTIFICATE_MEDIUMS = ['Video-Chat', 'E-Mail', 'Telefon', 'Chat-Nachrichten'] as const;

export enum CertificateState {
    manual = "manual", // student did not request approval
    awaitingApproval = "awaiting-approval", // pupil needs to sign certificate
    approved = "approved" // signed by pupil
}

export interface IExposedCertificate {
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
    state: CertificateState,
}

// CertificateErrors can safely be shown to users (they have readable error messages which do not contain secrets)
export class CertificateError extends Error { }

/* Pupils can retrieve certificates of their students, students can retrieve theirs */
export async function getCertificatesFor(user: Pupil | Student) {
    const entityManager = getManager();

    const certificatesData = await entityManager.find(ParticipationCertificate, {
        where: user instanceof Pupil ? { pupil: user.id } : { student: user.id },
        relations: ["student", "pupil"]
    });

    return certificatesData.map(cert => exposeCertificate(cert, /*to*/ user));
}

/* Students can download their certificates as PDF */
export async function getCertificatePDF(certificateId: string, _requestor: Student | PrismaStudent, lang: Language): Promise<Buffer> {
    const entityManager = getManager();

    const requestor = await entityManager.findOneOrFail(Student, { id: _requestor.id });

    /* Retrieve the certificate and also get the signature columns that are usually hidden for performance reasons */
    const certificate = await entityManager.findOne(ParticipationCertificate, { uuid: certificateId.toUpperCase(), student: requestor }, {
        relations: ["student", "pupil"],
        /* Unfortunately there is no "*" option which would also select the signatures. The query builder also does not cover this case */
        select: ["uuid", "categories", "certificateDate", "endDate", "hoursPerWeek", "hoursTotal", "id", "medium", "ongoingLessons", "signatureParent", "signaturePupil", "signatureDate", "signatureLocation", "startDate", "state", "subjects"]
    });

    if (!certificate) {
        throw new CertificateError("Certificate not found");
    }

    const pdf = await createPDFBinary(
        certificate,
        getCertificateLink(certificate, lang),
        lang as Language
    );

    return pdf;
}

export interface ICertificateCreationParams {
    endDate: number,
    subjects: string,
    hoursPerWeek: number,
    hoursTotal: number,
    medium: string,
    activities: string,
    ongoingLessons: boolean,
    state: CertificateState.manual | CertificateState.awaitingApproval
}

/* Students can create certificates, which pupils can then sign */
export async function createCertificate(_requestor: Student | PrismaStudent, pupilId: number, params: ICertificateCreationParams): Promise<ParticipationCertificate> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    const requestor = await entityManager.findOneOrFail(Student, { id: _requestor.id });
    const pupil = await entityManager.findOne(Pupil, { id: pupilId });

    if (!pupil) {
        throw new CertificateError(`Pupil not found`);
    }

    const match = await entityManager.findOne(Match, { student: requestor, pupil: pupil });

    if (!match) {
        throw new CertificateError(`No Match found with uuid '${pupil}'`);
    }

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
            student: pc.student
        });
    }

    return pc;
}

/* Everybody who sees a certificate can verify it's authenticity through a public endpoint, which shows the confirmation page */
export async function getConfirmationPage(certificateId: string, lang: Language) {
    const entityManager = getManager();

    const certificate = await entityManager.findOne(ParticipationCertificate, { uuid: certificateId.toUpperCase() }, { relations: ["student", "pupil"] });

    if (!certificate) {
        throw new CertificateError(`Certificate not found`);
    }

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

/* Pupils can sign certificates for their students through a webinterface */
export async function signCertificate(certificateId: string, _signer: Pupil | PrismaPupil, signatureParent: string | undefined, signaturePupil: string | undefined, signatureLocation: string) {
    assert(signaturePupil || signatureParent, "Parent or Pupil signs certificate");
    assert(!signaturePupil || signaturePupil.match(VALID_BASE64), "Pupil Signature is valid Base 64");
    assert(!signatureParent || signatureParent.match(VALID_BASE64), "Parent Signature is valid Base 64");
    assert(signatureLocation, "Singature location must be set");

    const entityManager = getManager();

    const signer = await entityManager.findOneOrFail(Pupil, { id: _signer.id });

    const certificate = await entityManager.findOne(ParticipationCertificate, { pupil: signer, uuid: certificateId.toUpperCase() }, { relations: ["student", "pupil"] });

    if (!certificate) {
        throw new CertificateError("Missing certificateID or the pupil is not allowed to sign this certificate");
    }

    if (certificate.state === "approved") {
        throw new CertificateError("Certificate was already signed");
    }

    if (certificate.state === "manual") {
        throw new CertificateError("Certificate cannot be signed as it is a manual one");
    }

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

    const rendered = await createPDFBinary(certificate, getCertificateLink(certificate, "de"), "de");

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

/* ------------------------- INTERNAL CERTIFICATE UTILITIES --------------------------------------- */

const _templates: { [name: string]: { [key in Language | "default"]?: EJS.ClientFunction } } = {};

/* Loads the template from the /assets folder, falls back to the default language if fallback is true */
function loadTemplate(name, lang: Language, fallback: boolean = true): EJS.ClientFunction {
    if (_templates[name] && _templates[name][lang]) {
        return _templates[name][lang];
    }

    let file = path.join(__dirname, `../../assets/${name}.${lang}.html`);
    console.log("Loading template from ", file);

    if (existsSync(file)) {
        const result = readFileSync(file, "utf8");
        if (!_templates[name]) {
            _templates[name] = {};
        }

        const compiled = EJS.compile(result);

        _templates[name][lang] = compiled;
        return compiled;
    } else {
        if (!fallback || lang === DefaultLanguage) {
            throw new Error(`Cannot find template '${file}`);
        }

        return loadTemplate(name, DefaultLanguage, /*fallback:*/ false);
    }
}

/* Map the certificate data to something the frontend can work with while keeping user data secret */
function exposeCertificate({ student, pupil, state, ...cert }: ParticipationCertificate, to: Student | Pupil): IExposedCertificate {
    return {
        ...cert,
        // NOTE: user.id is NOT unique, as Students and Pupils can have the same id
        userIs: pupil.wix_id === to.wix_id ? "pupil" : "student",
        pupil: { firstname: pupil.firstname, lastname: pupil.lastname },
        student: { firstname: student.firstname, lastname: student.lastname },
        state: state as CertificateState
    };
}

function getCertificateLink(certificate: ParticipationCertificate, lang: Language) {
    return "http://verify.corona-school.de/" + certificate.uuid + "?lang=" + lang;
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

