import * as Express from "express";
import * as multer from "multer";
import { File, FileID, getFile, addFile } from "../../../graphql/files";

const fileUpload = multer({
    limits: {
        fileSize: 5 * (10 ** 6) // 5mb
    },
    storage: multer.memoryStorage(),
});

const fileRouter = Express.Router();

fileRouter.post("/upload", fileUpload.single("file"), (req, res) => {
    const file = req.body["file"];

    if (!file) {
        return res.status(400).send("Missing file");
    }

    if (file.encoding !== "utf-8") {
        return res.status(400).send("Invalid file encoding. Expected UTF-8");
    }

    const fileID = addFile(file);

    return res.status(200).send(fileID);
});

fileRouter.get("/download/:fileID", (req, res) => {
    const { fileID }: { fileID: FileID } = req.params;
    if (!fileID) {
        return res.status(400).send("Missing FileID");
    }

    try {
        const file = getFile(fileID);
        res.sendFile(file);
    } catch(error) {
        return res.status(404).send("File not Found");
    }

});
