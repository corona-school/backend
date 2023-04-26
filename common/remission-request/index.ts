import { Student as TypeORMStudent } from '../entity/Student';
import { student, student as PrismaStudent } from '@prisma/client';
import { prisma } from '../prisma';
import { randomBytes } from 'crypto';
import { getLogger } from '../../common/logger/logger';
import EJS from 'ejs';
import { existsSync, readFileSync } from 'fs';
import { generatePDFFromHTMLString } from 'html-pppdf';
import path from 'path';
import QRCode from 'qrcode';

const logger = getLogger();

const assetPath = './assets';
const remissionRequestTemplateName = 'remissionRequestTemplate';
const verificationPageName = 'verifiedRemissionRequestPage';

const dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;

export async function createRemissionRequest(student: TypeORMStudent | PrismaStudent) {
    const remissionRequest = await prisma.remission_request.findUnique({
        where: { studentId: student.id },
    });

    if (!remissionRequest) {
        while (true) {
            try {
                await prisma.remission_request.create({
                    data: {
                        studentId: student.id,
                        uuid: randomBytes(5).toString('hex').toUpperCase(),
                    },
                });
                logger.info(`Created remisson request for student ${student.wix_id}`);
                break;
            } catch (e) {
                if (e.code !== 'P2002') {
                    throw e;
                }
            }
        }
    }
}

function loadTemplate(name: string): EJS.ClientFunction {
    const templatePath = `${assetPath}/${name}.html`;

    if (existsSync(templatePath)) {
        const result = readFileSync(templatePath, 'utf8');
        return EJS.compile(result);
    } else {
        throw new Error(`Cannot find template "${name}"`);
    }
}

async function createQRCode(uuid: string): Promise<string> {
    const verificationURL = `https://verify.lern-fair.de/${uuid}?ctype=remission`;
    return QRCode.toDataURL(verificationURL);
}

export async function createRemissionRequestPDF(student: { id: number; firstname: string; lastname: string }): Promise<Buffer> {
    const remissionRequest = await prisma.remission_request.findUnique({ where: { studentId: student.id } });

    if (remissionRequest === null) {
        return undefined;
    }

    const template = loadTemplate(remissionRequestTemplateName);

    let name = student.firstname + ' ' + student.lastname;

    if (process.env.ENV == 'dev') {
        name = `[TEST] ${name}`;
    }

    const result = template({
        NAMESTUDENT: name,
        DATUMHEUTE: remissionRequest.createdAt.toLocaleDateString('de-DE', dateFormatOptions),
        QR_CODE: await createQRCode(remissionRequest.uuid),
    });

    const ASSETS = __dirname + '/../../../assets';
    return await generatePDFFromHTMLString(result, {
        includePaths: [path.resolve(ASSETS)],
    });
}

export async function createRemissionRequestVerificationPage(remissionRequestUUID: string): Promise<string> {
    const remissionRequest = await prisma.remission_request.findUnique({ where: { uuid: remissionRequestUUID }, include: { student: true } });

    if (remissionRequest === null) {
        logger.info(`Could not find remission request with UUID ${remissionRequestUUID}`);
        return undefined;
    }

    const template = loadTemplate(verificationPageName);

    let name = `${remissionRequest.student.firstname} ${remissionRequest.student.lastname}`;

    if (process.env.ENV == 'dev') {
        name = `[TEST] ${name}`;
    }

    return template({
        NAMESTUDENT: name,
        DATUM: remissionRequest.createdAt.toLocaleDateString('de-DE'),
    });
}

export async function cancelRemissionRequest(student: student) {
    logger.info(`Cancelled remission request for Student(${student.id})`);
    await prisma.remission_request.delete({ where: { studentId: student.id } });
}
