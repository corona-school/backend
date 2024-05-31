import { readFileSync, existsSync } from 'fs';
import path from 'path';
import moment from 'moment';
import { randomBytes } from 'crypto';
import EJS from 'ejs';
import * as Notification from '../notification';
import { pupil as Pupil, student as Student, match as Match, participation_certificate as ParticipationCertificate } from '@prisma/client';
import assert from 'assert';
import { createSecretEmailToken } from '../secret';
import { User, userForPupil, userForStudent } from '../user';
import { USER_APP_DOMAIN } from '../util/environment';
import { generatePDFFromHTML } from '../util/pdf';
import { Request } from 'express';
import { logTransaction } from '../transactionlog/log';
import { prisma } from '../prisma';
import QRCode from 'qrcode';

const ASSETS = path.join(__dirname, `../../../assets/`);

export const VALID_BASE64 = /^data:image\/(png|jpeg);base64,([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/g;

// supported certificate languages:
export const LANGUAGES = ['de', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DefaultLanguage = 'de';

export const CERTIFICATE_MEDIUMS = ['Video-Chat', 'E-Mail', 'Telefon', 'Chat-Nachrichten'] as const;

export enum CertificateState {
    manual = 'manual', // student did not request approval
    awaitingApproval = 'awaiting-approval', // pupil needs to sign certificate
    approved = 'approved', // signed by pupil
}

export interface IExposedCertificate {
    userIs: 'pupil' | 'student';
    pupil: { firstname: string; lastname: string };
    student: { firstname: string; lastname: string };
    subjects: string;
    categories: string;
    certificateDate: Date;
    startDate: Date;
    endDate: Date;
    uuid: string;
    hoursPerWeek: number;
    hoursTotal: number;
    medium: string;
    state: CertificateState;
}

// CertificateErrors can safely be shown to users (they have readable error messages which do not contain secrets)
export class CertificateError extends Error {}

/* Pupils can retrieve certificates of their students, students can retrieve theirs */
export async function getCertificatesFor(user: User) {
    const certificatesData = await prisma.participation_certificate.findMany({
        where: { pupilId: user.pupilId ?? undefined, studentId: user.studentId ?? undefined },
        include: { student: true, pupil: true },
    });

    return certificatesData.map((cert) => exposeCertificate(cert, /*to*/ user));
}

/* Students can download their certificates as PDF */
export async function getCertificatePDF(certificateId: string, requestor: Student, lang: Language): Promise<Buffer> {
    /* Retrieve the certificate and also get the signature columns that are usually hidden for performance reasons */
    const certificate = await prisma.participation_certificate.findFirst({
        where: { uuid: certificateId.toUpperCase(), studentId: requestor.id },
        include: { student: true, pupil: true },
    });

    if (!certificate) {
        throw new CertificateError('Certificate not found');
    }

    const pdf = await createPDFBinary(certificate, getCertificateLink(certificate, lang), lang as Language);

    return pdf;
}

export interface ICertificateCreationParams {
    startDate?: Date;
    endDate: Date;
    subjects: string;
    hoursPerWeek: number;
    hoursTotal: number;
    medium: string;
    activities: string;
    ongoingLessons: boolean;
    state: CertificateState.manual | CertificateState.awaitingApproval;
}

export async function issueCertificateRequest(pc: CertWithUsers) {
    const authToken = await createSecretEmailToken(userForPupil(pc.pupil));
    // We show an important message on the dashboard, where pupils can sign the certificate:
    const certificateLink = USER_APP_DOMAIN;
    await Notification.actionTaken(userForPupil(pc.pupil), 'pupil_certificate_approval', {
        uniqueId: `${pc.id}`,
        certificateLink,
        student: pc.student,
    });
}

/* Students can create certificates, which pupils can then sign */
export async function createCertificate(requestor: Student, matchId: string, params: ICertificateCreationParams): Promise<ParticipationCertificate> {
    const match = await prisma.match.findFirst({ where: { uuid: matchId, studentId: requestor.id } });
    if (!match) {
        throw new CertificateError(`No Match found with id '${matchId}'`);
    }

    let uuid;
    do {
        uuid = randomBytes(5).toString('hex').toUpperCase();
    } while ((await prisma.participation_certificate.count({ where: { uuid } })) > 0);

    const certificate = await prisma.participation_certificate.create({
        data: {
            uuid,
            pupilId: match.pupilId,
            studentId: match.studentId,
            subjects: params.subjects,
            categories: params.activities,
            hoursPerWeek: params.hoursPerWeek,
            hoursTotal: params.hoursTotal,
            medium: params.medium,
            startDate: params.startDate ?? match.createdAt,
            endDate: params.endDate,
            ongoingLessons: params.ongoingLessons,
            state: params.state,
        },
        include: { student: true, pupil: true },
    });

    await logTransaction('certificateRequest', userForStudent(requestor), { uuid: match.uuid });

    if (params.state === 'awaiting-approval') {
        await issueCertificateRequest(certificate);
    }

    return certificate;
}

/* Everybody who sees a certificate can verify it's authenticity through a public endpoint, which shows the confirmation page */
export async function getConfirmationPage(certificateId: string, lang: Language) {
    const certificate = await prisma.participation_certificate.findFirst({
        where: { uuid: certificateId.toUpperCase() },
        include: { pupil: true, student: true },
    });

    if (!certificate) {
        throw new CertificateError(`Certificate not found`);
    }

    const verificationTemplate = loadTemplate('verifiedCertificatePage', lang);

    return verificationTemplate({
        NAMESTUDENT: certificate.student?.firstname + ' ' + certificate.student?.lastname,
        NAMESCHUELER: certificate.pupil?.firstname + ' ' + certificate.pupil?.lastname,
        DATUMHEUTE: moment(certificate.certificateDate).format('D.M.YYYY'),
        SCHUELERSTART: moment(certificate.startDate).format('D.M.YYYY'),
        SCHUELERENDE: moment(certificate.endDate).format('D.M.YYYY'),
        SCHUELERFAECHER: certificate.subjects.split(','),
        SCHUELERFREITEXT: certificate.categories.split(/(?:\r\n|\r|\n)/g),
        SCHUELERPROWOCHE: certificate.hoursPerWeek?.toFixed(2) ?? '?',
        SCHUELERGESAMT: certificate.hoursTotal?.toFixed(2) ?? '?',
        MEDIUM: certificate.medium,
        SCREENINGDATUM: moment(certificate.student.createdAt).format('D.M.YYYY'),
        ONGOING: certificate.ongoingLessons,
    });
}

/* Pupils can sign certificates for their students through a webinterface */
export async function signCertificate(
    certificateId: string,
    signer: Pupil,
    signatureParent: string | undefined,
    signaturePupil: string | undefined,
    signatureLocation: string
) {
    assert(signaturePupil || signatureParent, 'Parent or Pupil signs certificate');
    assert(!signaturePupil || signaturePupil.match(VALID_BASE64), 'Pupil Signature is valid Base 64');
    assert(!signatureParent || signatureParent.match(VALID_BASE64), 'Parent Signature is valid Base 64');
    assert(signatureLocation, 'Singature location must be set');

    const certificate = await prisma.participation_certificate.findFirst({
        where: { pupilId: signer.id, uuid: certificateId.toUpperCase() },
        include: { pupil: true, student: true },
    });

    if (!certificate) {
        throw new CertificateError('Missing certificateID or the pupil is not allowed to sign this certificate');
    }

    if (certificate.state === 'approved') {
        throw new CertificateError('Certificate was already signed');
    }

    if (certificate.state === 'manual') {
        throw new CertificateError('Certificate cannot be signed as it is a manual one');
    }

    const update: Partial<ParticipationCertificate> = {};

    if (signatureParent) {
        update.signatureParent = Buffer.from(signatureParent, 'utf-8');
    }

    if (signaturePupil) {
        update.signaturePupil = Buffer.from(signaturePupil, 'utf-8');
    }

    update.signatureDate = new Date();
    update.signatureLocation = signatureLocation;
    update.state = 'approved';

    const signedCert = await prisma.participation_certificate.update({
        where: { id: certificate.id },
        data: update,
        include: { pupil: true, student: true },
    });

    const rendered = await createPDFBinary(signedCert, getCertificateLink(signedCert, 'de'), 'de');

    const authToken = await createSecretEmailToken(userForStudent(signedCert.student));
    const certificateLink = `${USER_APP_DOMAIN}/profile`;
    await Notification.actionTaken(userForStudent(signedCert.student), 'student_certificate_sign', {
        uniqueId: `${certificate.id}`,
        certificateLink,
        pupil: certificate.pupil,
    });
}

/* ------------------------- INTERNAL CERTIFICATE UTILITIES --------------------------------------- */

const _templates: { [name: string]: { [key in Language | 'default']?: EJS.ClientFunction } } = {};

/* Loads the template from the /assets folder, falls back to the default language if fallback is true */
function loadTemplate(name, lang: Language, fallback = true): EJS.ClientFunction {
    if (_templates[name] && _templates[name][lang]) {
        return _templates[name][lang];
    }

    const file = path.join(ASSETS, `${name}.${lang}.html`);
    console.log('Loading template from ', file);

    if (existsSync(file)) {
        const result = readFileSync(file, 'utf8');
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

type CertWithUsers = ParticipationCertificate & { student: Student; pupil: Pupil };

/* Map the certificate data to something the frontend can work with while keeping user data secret */
function exposeCertificate(
    {
        student,
        pupil,
        state,
        categories,
        certificateDate,
        endDate,
        hoursPerWeek,
        hoursTotal,
        uuid,
        medium,
        ongoingLessons,
        signatureDate,
        signatureLocation,
        startDate,
        subjects,
    }: CertWithUsers,
    to: User
): IExposedCertificate {
    return {
        categories,
        certificateDate,
        endDate,
        hoursPerWeek: +hoursPerWeek,
        hoursTotal: +hoursTotal,
        medium,
        startDate,
        subjects,
        uuid,
        userIs: pupil.id === to.pupilId ? 'pupil' : 'student',
        pupil: { firstname: pupil.firstname, lastname: pupil.lastname },
        student: { firstname: student.firstname, lastname: student.lastname },
        state: state as CertificateState,
    };
}

function getCertificateLink(certificate: ParticipationCertificate, lang: Language) {
    return 'http://verify.lern-fair.de/' + certificate.uuid + '?lang=' + lang;
}

export function convertCertificateLinkToApiLink(req: Request) {
    const url = new URL('https://api.lern-fair.de');

    url.pathname = `/api/certificate/${req.params.certificateId}/confirmation`;
    for (const [key, value] of Object.entries(req.query)) {
        url.searchParams.append(key, value as string);
    }

    return url.toString();
}

async function createPDFBinary(certificate: CertWithUsers, link: string, lang: Language): Promise<Buffer> {
    const { student, pupil } = certificate;

    const template = loadTemplate('certificateTemplate', lang);

    let name = student.firstname + ' ' + student.lastname;

    if (process.env.ENV == 'dev') {
        name = `[TEST] ${name}`;
    }

    const result = template({
        NAMESTUDENT: name,
        NAMESCHUELER: pupil.firstname + ' ' + pupil.lastname,
        DATUMHEUTE: moment().format('D.M.YYYY'),
        SCHUELERSTART: moment(certificate.startDate, 'X').format('D.M.YYYY'),
        SCHUELERENDE: moment(certificate.endDate, 'X').format('D.M.YYYY'),
        SCHUELERFAECHER: certificate.subjects.split(','),
        SCHUELERFREITEXT: certificate.categories.split(/(?:\r\n|\r|\n)/g),
        SCHUELERPROWOCHE: certificate.hoursPerWeek,
        SCHUELERGESAMT: certificate.hoursTotal,
        MEDIUM: certificate.medium,
        CERTLINK: link,
        CERTLINKTEXT: link,
        ONGOING: certificate.ongoingLessons,
        SIGNATURE_PARENT: certificate.signatureParent?.toString('utf-8'),
        SIGNATURE_PUPIL: certificate.signaturePupil?.toString('utf-8'),
        SIGNATURE_LOCATION: certificate.signatureLocation,
        SIGNATURE_DATE: certificate.signatureDate && moment(certificate.signatureDate).format('D.M.YYYY'),
        QR_CODE: await QRCode.toDataURL(link),
    });

    return await generatePDFFromHTML(result, {
        includePaths: [path.resolve(ASSETS)],
    });
}
