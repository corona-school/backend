import { closeBrowser, generatePDFFromHTMLString, Options, setupBrowser } from 'html-pppdf';
import { getLogger } from '../logger/logger';

const logger = getLogger('PDF');

let browserSetupDone = false;
async function ensureBrowserSetup() {
    if (browserSetupDone) {
        return;
    }

    await setupBrowser({
        args: ['--no-sandbox'], //don't run in a sandbox, cause we have only trusted content and our server do not support a sandbox
        handleSIGTERM: false, //don't close chrome on sigterm, which heroku sends to all processes
    });
    logger.info('Setup PDF generation environment');

    browserSetupDone = true;
}

process.on('SIGTERM', async () => {
    if (browserSetupDone) {
        await closeBrowser();
        logger.info('Shutdown PDF generation environment');
    }
});

export async function generatePDFFromHTML(html: string, options: Options) {
    await ensureBrowserSetup();

    logger.info('Started generating PDF file');
    const result = await generatePDFFromHTMLString(html, options);
    logger.info('Finished generating PDF file');
    return result;
}
