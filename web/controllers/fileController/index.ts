import { Router } from 'express';
import { getLogger } from '../../../common/logger/logger';
import multer from 'multer';
import { File, FileID, getFile, addFile, removeFile } from '../../../graphql/files';

const log = getLogger('File API');

const fileUpload = multer({
    limits: {
        fileSize: 10 * 10 ** 6, // 10mb
    },
    storage: multer.memoryStorage(),
});

export const fileRouter = Router();

fileRouter.post('/upload', fileUpload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Missing file');
    }

    try {
        const fileID = addFile(req.file);
        log.info(`File was uploaded from ${req.ip} with id ${fileID}`);
        return res.status(200).send(fileID);
    } catch (error) {
        log.error(`${req.ip} Failed to upload file`, error);
        return res.status(503).send('Could not upload file. Please wait some time for the service to recover before retrying');
    }
});

fileRouter.get('/download/:fileID', (req, res) => {
    const { fileID }: { fileID: FileID } = req.params;
    if (!fileID) {
        return res.status(400).send('Missing FileID');
    }

    try {
        const file = getFile(fileID);
        res.attachment(file.originalname);
        res.type(file.mimetype);
        res.send(file.buffer);
        removeFile(fileID);
    } catch (error) {
        log.error(`${req.ip} failed to download file `, error);
        return res.status(404).send('File not Found');
    }
});
