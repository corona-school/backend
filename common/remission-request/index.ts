import { Student } from "../entity/Student";
import { prisma } from "../prisma";
import { randomBytes } from "crypto";
import { getLogger } from "log4js";
import EJS from "ejs";
import { existsSync, readFileSync } from "fs";
import { generatePDFFromHTMLString } from "html-pppdf";
import path from "path";
import QRCode from "qrcode";

const logger = getLogger();

const templatePath = `./assets/remissionRequestTemplate.html`;
const dateFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" } as const;

export async function createRemissionRequest(student: Student) {
    const remissionRequest = await prisma.remission_request.findUnique({
        where: { studentId: student.id }
    });

    if (!remissionRequest) {
        while (true) {
            try {
                await prisma.remission_request.create({
                    data: {
                        studentId: student.id,
                        uuid: randomBytes(5).toString("hex")
                            .toUpperCase()
                    }
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

function loadTemplate(): EJS.ClientFunction {
    if (existsSync(templatePath)) {
        const result = readFileSync(templatePath, "utf8");
        return EJS.compile(result);
    } else {
        throw new Error(`Cannot find remission request template`);
    }
}

async function createQRCode(uuid: string): Promise<string> {
    return QRCode.toDataURL(uuid);
}

export async function createRemissionRequestPDF(student: Student): Promise<Buffer> {
    const template = loadTemplate();
    const remissionRequest = await prisma.remission_request.findUnique({ where: {studentId: student.id}});

    if (remissionRequest === null) {
        return undefined;
    }

    let name = student.firstname + " " + student.lastname;

    if (process.env.ENV == 'dev') {
        name = `[TEST] ${name}`;
    }

    const result = template({
        NAMESTUDENT: name,
        DATUMHEUTE: remissionRequest.createdAt.toLocaleDateString('de-DE', dateFormatOptions),
        QR_CODE: await createQRCode(remissionRequest.uuid)
    });

    const ASSETS = __dirname + "/../../../assets";
    return await generatePDFFromHTMLString(result, {
        includePaths: [
            path.resolve(ASSETS)
        ]
    });
}