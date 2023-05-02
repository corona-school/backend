import { existsSync, readFileSync } from 'fs';
import { generatePDFFromHTMLString } from 'html-pppdf';
import path from 'path';
import moment from 'moment';
import CertificateRequestEvent from '../transactionlog/types/CertificateRequestEvent';
import { getTransactionLog } from '../transactionlog';
import { randomBytes } from 'crypto';
import EJS from 'ejs';
import { mailjetTemplates, sendTemplateMail } from '../mails';
import { createAutoLoginLink } from '../../web/controllers/utils';
import * as Notification from '../notification';
import { participation_certificate as PrismaParticipationCertificate, Prisma, pupil as PrismaPupil, student as PrismaStudent } from '@prisma/client';
import assert from 'assert';
import { prisma } from '../prisma';
import { Decimal } from '@prisma/client/runtime';

// TODO: Replace TypeORM operations with Prisma

const ASSETS = path.join(__dirname, `../../../assets/`);

export const VALID_BASE64 = /^data\:image\/(png|jpeg)\;base64\,([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/g;

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
export async function getCertificatesFor(user: PrismaPupil | PrismaStudent) {
    const certificatesData = await prisma.participation_certificate.findMany({
        where: user.hasOwnProperty('isPupil') ? { pupilId: user.id } : { studentId: user.id },
        include: { student: true, pupil: true },
    });

    return certificatesData.map((cert) => exposeCertificate(cert, /*to*/ user));
}

/* Students can download their certificates as PDF */
export async function getCertificatePDF(certificateId: string, _requester: PrismaStudent, lang: Language): Promise<Buffer> {
    const requester = await prisma.student.findUniqueOrThrow({ where: { id: _requester.id } });

    /* Retrieve the certificate and also get the signature columns that are usually hidden for performance reasons */
    const certificate = await prisma.participation_certificate.findFirstOrThrow({
        where: {
            uuid: certificateId.toUpperCase(),
            studentId: requester.id,
        },
        include: {
            student: true,
            pupil: true,
        },
    });

    // const certificate = await entityManager.findOne(
    //     ParticipationCertificate,
    //     { uuid: certificateId.toUpperCase(), student: requestor },
    //     {
    //         relations: ['student', 'pupil'],
    //         /* Unfortunately there is no "*" option which would also select the signatures. The query builder also does not cover this case */
    //         select: [
    //             'uuid',
    //             'categories',
    //             'certificateDate',
    //             'endDate',
    //             'hoursPerWeek',
    //             'hoursTotal',
    //             'id',
    //             'medium',
    //             'ongoingLessons',
    //             'signatureParent',
    //             'signaturePupil',
    //             'signatureDate',
    //             'signatureLocation',
    //             'startDate',
    //             'state',
    //             'subjects',
    //         ],
    //     }
    // );

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

export async function issueCertificateRequest(pc: PrismaParticipationCertificate & { pupil: PrismaPupil; student: PrismaStudent }) {
    const certificateLink = createAutoLoginLink(pc.pupil, `/settings?sign=${pc.uuid}`);
    const mail = mailjetTemplates.CERTIFICATEREQUEST({
        certificateLink,
        pupilFirstname: pc.pupil.firstname,
        studentFirstname: pc.student.firstname,
    });
    await sendTemplateMail(mail, pc.pupil.email);
    await Notification.actionTaken(pc.pupil, 'pupil_certificate_approval', {
        uniqueId: `${pc.id}`,
        certificateLink,
        student: pc.student,
    });
}

export async function createCertificateLEGACY(
    _requestor: PrismaStudent,
    matchId: string,
    params: Omit<ICertificateCreationParams, 'endDate'> & { endDate: number /* UNIX timestamp in seconds */ }
) {
    return await createCertificate(_requestor, matchId, {
        ...params,
        endDate: params.endDate && moment(params.endDate, 'X').toDate(),
    });
}

/* Students can create certificates, which pupils can then sign */
export async function createCertificate(
    _requestor: PrismaStudent,
    matchId: string,
    params: ICertificateCreationParams
): Promise<PrismaParticipationCertificate & { pupil: PrismaPupil; student: PrismaStudent }> {
    const transactionLog = getTransactionLog();

    const requestor = await prisma.student.findUniqueOrThrow({ where: { id: _requestor.id } });

    const match = await prisma.match.findFirst({ where: { uuid: matchId, studentId: requestor.id } });
    if (!match) {
        throw new CertificateError(`No Match found with id '${matchId}'`);
    }

    let pc: Omit<PrismaParticipationCertificate, 'id'> = {
        categories: params.activities,
        certificateDate: undefined,
        endDate: params.endDate,
        hoursPerWeek: new Decimal(params.hoursPerWeek),
        hoursTotal: new Decimal(params.hoursTotal),
        medium: params.medium,
        ongoingLessons: params.ongoingLessons,
        pupilId: match.pupilId,
        signatureDate: undefined,
        signatureLocation: '',
        signatureParent: undefined,
        signaturePupil: undefined,
        startDate: params.startDate ?? match.createdAt,
        state: params.state,
        studentId: requestor.id,
        subjects: params.subjects,
        uuid: undefined,
    };

    do {
        pc.uuid = randomBytes(5).toString('hex').toUpperCase();
    } while (await prisma.participation_certificate.findUnique({ where: { uuid: pc.uuid } }));

    const resPc = await prisma.participation_certificate.create({ data: pc, include: { pupil: true, student: true } });
    await transactionLog.log(new CertificateRequestEvent(requestor, match.uuid));

    if (params.state === 'awaiting-approval') {
        await issueCertificateRequest(resPc);
    }

    return resPc;
}

/* Everybody who sees a certificate can verify it's authenticity through a public endpoint, which shows the confirmation page */
export async function getConfirmationPage(certificateId: string, lang: Language) {
    const certificate = await prisma.participation_certificate.findUnique({
        where: {
            uuid: certificateId.toUpperCase(),
        },
        include: {
            student: {
                include: {
                    screening: true,
                },
            },
            pupil: true,
        },
    });
    if (!certificate) {
        throw new CertificateError(`Certificate not found`);
    }

    let verificationTemplate = loadTemplate('verifiedCertificatePage', lang);

    const screeningDate = (await certificate.student?.screening)?.createdAt;

    return verificationTemplate({
        NAMESTUDENT: certificate.student?.firstname + ' ' + certificate.student?.lastname,
        NAMESCHUELER: certificate.pupil?.firstname + ' ' + certificate.pupil?.lastname,
        DATUMHEUTE: moment(certificate.certificateDate).format('D.M.YYYY'),
        SCHUELERSTART: moment(certificate.startDate).format('D.M.YYYY'),
        SCHUELERENDE: moment(certificate.endDate).format('D.M.YYYY'),
        SCHUELERFAECHER: certificate.subjects.split(','),
        SCHUELERFREITEXT: certificate.categories.split(/(?:\r\n|\r|\n)/g),
        SCHUELERPROWOCHE: certificate.hoursPerWeek.toFixed(2),
        SCHUELERGESAMT: certificate.hoursTotal.toFixed(2),
        MEDIUM: certificate.medium,
        SCREENINGDATUM: screeningDate ? moment(screeningDate).format('D.M.YYYY') : '[UNBEKANNTES DATUM]',
        ONGOING: certificate.ongoingLessons,
    });
}

/* Pupils can sign certificates for their students through a webinterface */
export async function signCertificate(
    certificateId: string,
    _signer: PrismaPupil,
    signatureParent: string | undefined,
    signaturePupil: string | undefined,
    signatureLocation: string
) {
    assert(signaturePupil || signatureParent, 'Parent or Pupil signs certificate');
    assert(!signaturePupil || signaturePupil.match(VALID_BASE64), 'Pupil Signature is valid Base 64');
    assert(!signatureParent || signatureParent.match(VALID_BASE64), 'Parent Signature is valid Base 64');
    assert(signatureLocation, 'Singature location must be set');

    const signer = await prisma.pupil.findUniqueOrThrow({
        where: {
            id: _signer.id,
        },
    });
    const certificate = await prisma.participation_certificate.findFirst({
        where: {
            pupilId: signer.id,
            uuid: certificateId.toUpperCase(),
        },
        include: {
            pupil: true,
            student: true,
        },
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

    let updateData: Prisma.participation_certificateUncheckedUpdateInput = {};

    if (signatureParent) {
        updateData.signatureParent = Buffer.from(signatureParent, 'utf-8');
    }

    if (signaturePupil) {
        updateData.signaturePupil = Buffer.from(signaturePupil, 'utf-8');
    }

    updateData.signatureDate = new Date();
    updateData.signatureLocation = signatureLocation;
    updateData.state = 'approved';

    await prisma.participation_certificate.update({
        where: {
            uuid: certificate.uuid,
        },
        data: updateData,
    });

    const rendered = await createPDFBinary(certificate, getCertificateLink(certificate, 'de'), 'de');

    const certificateLink = createAutoLoginLink(certificate.student, `/settings`);
    const mail = mailjetTemplates.CERTIFICATESIGNED(
        {
            certificateLink,
            pupilFirstname: certificate.pupil.firstname,
            studentFirstname: certificate.student.firstname,
        },
        rendered.toString('base64')
    );
    await sendTemplateMail(mail, certificate.student.email);
    await Notification.actionTaken(certificate.student, 'student_certificate_sign', {
        uniqueId: `${certificate.id}`,
        certificateLink,
        pupil: certificate.pupil,
    });
}

/* ------------------------- INTERNAL CERTIFICATE UTILITIES --------------------------------------- */

const _templates: { [name: string]: { [key in Language | 'default']?: EJS.ClientFunction } } = {};

/* Loads the template from the /assets folder, falls back to the default language if fallback is true */
function loadTemplate(name, lang: Language, fallback: boolean = true): EJS.ClientFunction {
    if (_templates[name] && _templates[name][lang]) {
        return _templates[name][lang];
    }

    let file = path.join(ASSETS, `${name}.${lang}.html`);
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

/* Map the certificate data to something the frontend can work with while keeping user data secret */
function exposeCertificate(
    { student, pupil, state, ...cert }: PrismaParticipationCertificate & { pupil: PrismaPupil; student: PrismaStudent },
    to: PrismaPupil | PrismaStudent
): IExposedCertificate {
    return {
        ...cert,
        // NOTE: user.id is NOT unique, as Students and Pupils can have the same id
        userIs: pupil.wix_id === to.wix_id ? 'pupil' : 'student',
        pupil: { firstname: pupil.firstname, lastname: pupil.lastname },
        student: { firstname: student.firstname, lastname: student.lastname },
        state: state as CertificateState,
        hoursPerWeek: cert.hoursPerWeek.toNumber(),
        hoursTotal: cert.hoursTotal.toNumber(),
    };
}

function getCertificateLink(certificate: PrismaParticipationCertificate, lang: Language) {
    return 'http://verify.corona-school.de/' + certificate.uuid + '?lang=' + lang;
}

async function createPDFBinary(
    certificate: PrismaParticipationCertificate & { pupil: PrismaPupil; student: PrismaStudent },
    link: string,
    lang: Language
): Promise<Buffer> {
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
    });

    return await generatePDFFromHTMLString(result, {
        includePaths: [path.resolve(ASSETS)],
    });
}
