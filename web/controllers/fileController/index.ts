import { Router } from "express";
import multer from "multer";
import { File, FileID, getFile, addFile } from "../../../graphql/files";

const fileUpload = multer({
    limits: {
        fileSize: 5 * (10 ** 6) // 5mb
    },
    storage: multer.memoryStorage(),
});

export const fileRouter = Router();

fileRouter.post("/upload", fileUpload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("Missing file");
    }

    const fileID = addFile(req.file);

    return res.status(200).send(fileID);
});

fileRouter.get("/download/:fileID", (req, res) => {
    const { fileID }: { fileID: FileID } = req.params;
    if (!fileID) {
        return res.status(400).send("Missing FileID");
    }

    try {
        const file = getFile(fileID);
        res.attachment(file.originalname);
        res.type(file.mimetype);
        res.send(file.buffer);
    } catch (error) {
        return res.status(404).send("File not Found");
    }

});
