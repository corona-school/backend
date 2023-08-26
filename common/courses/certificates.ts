import EJS from 'ejs';
import { readFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import moment from 'moment-timezone';
import { generatePDFFromHTMLString } from 'html-pppdf';

const TEMPLATE_FOLDER = './assets/courses/certificate';
const TEMPLATE_ASSETS_FOLDER = `${TEMPLATE_FOLDER}/assets`;
const CERTFICATE_PATH = `${TEMPLATE_FOLDER}/certificateTemplate.de.html`;

let cachedTemplate: EJS.ClientFunction = null;

/* Loads the template from the /assets folder, falls back to the default language if fallback is true */
function getTemplate(): EJS.ClientFunction {
    if (!cachedTemplate) {
        const path = CERTFICATE_PATH;

        cachedTemplate = EJS.compile(readFileSync(path, 'utf8'));
    }

    return cachedTemplate;
}

interface Lecture {
    start: Date;
    duration: number;
}
export async function getCourseCertificate(
    studentUUID: string,
    pupilUUID: string,
    fullName: string,
    courseName: string,
    lectures: Lecture[],
    totalWorkload: number
): Promise<Buffer> {
    const template = getTemplate();

    const htmlString = template({
        FULLNAME: fullName,
        COURSENAME: courseName,
        LECTURES: lectures,
        TOTALWORKLOAD: totalWorkload,
        moment: moment,
    });

    const includePaths = process.env.ENV === 'dev' ? [] : [resolvePath(TEMPLATE_ASSETS_FOLDER)]; //only include assets in production

    const buffer = await generatePDFFromHTMLString(htmlString, {
        includePaths,
    });

    return buffer;
}
