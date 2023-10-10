/* ------------- File Handling in GraphQL -------------
 As GraphQL is inherently a bad choice for transporting files,
  file up and downloading happens via regular HTTP endpoints.

 When a user uploads a file via POSTing to /api/file/upload,
 the file is stored temporarily in memory for 10 minutes.
 The endpoint returns a FileID, which can then be passed to a GraphQL Mutation,
  which can then use that to retrieve the file (or multiple) from the store.

 @Mutation(...)
 addSomeFile(@Arg("fileID") fileID: string) {
    const file = getFile(fileID);
 }

 To provide a file for download, the process happens in reverse,
 the Mutation (Resolvers are a bad place, as they might be called hundreds of times in a single query)
 writes the file into the store, and then returns the URL to the file.
 The client can then stream the file from there.

 @Mutation(returns => String)
 getSomeFile() {
    const file = getSomeFile();
    return getFileURL(addFile(file));
 }

 The advantage is that users can retry upload and download (which depending on network stability and bandwith
    could take some time), also this provides a relatively generic API that can be used in different scenarios.
 As a downside, validations of files and users happens quite late (unauthenticated users can upload any file of any type),
  thus one can potentially overload the server with files. To guard against OOM, the server rejects file uploads very early,
  ensuring availability of the overall system while sacrificing availability of file handling.
*/

import { metrics, stats } from '../common/logger/metrics';
import { v4 as uuid } from 'uuid';
import { getLogger } from '../common/logger/logger';

const FILE_STORAGE_DURATION = 10 * 60 * 1000; // After 10 Minutes, files are removed from the store
const FILE_STORAGE_MAX_SIZE = 50; // Prevent file storage from growing infinitely, potentially leading to OOM

const log = getLogger('GraphQL Files');

export interface File {
    originalname: string; //	Name of the file on the user's computer
    mimetype: string;
    buffer: Buffer; // of UTF-8 encoded data
    size: number;
}

export type FileID = string;

const fileStore = new Map<FileID, File>();
metrics.FILE_STORAGE_SIZE.set(0);
metrics.FILE_STORAGE_MAX_SIZE.set(FILE_STORAGE_MAX_SIZE);

export function addFile(file: File): FileID {
    if (fileStore.size >= FILE_STORAGE_MAX_SIZE) {
        throw new Error(`FileStorage is full. Please wait some time till old files are cleaned up`);
    }

    const fileID: FileID = uuid();
    fileStore.set(fileID, file);

    setTimeout(() => {
        fileStore.delete(fileID);
        log.info(`Cleaned up '${fileID}' from file store`);
    }, FILE_STORAGE_DURATION);

    log.info(`Added file '${fileID}' to file store with name ${file.originalname}, type ${file.mimetype} and size ${file.buffer.length}`);
    metrics.FILE_STORAGE_SIZE.inc();

    return fileID;
}

export function getFile(fileID: FileID): File {
    const file = fileStore.get(fileID);
    if (!file) {
        throw new Error(`Invalid fileID(${fileID})`);
    }
    return file;
}

export const getFiles = (fileIDs: FileID[]) => fileIDs.map(getFile);

export function getFileURL(fileID: FileID): string {
    return `/api/files/download/${fileID}`;
}

export function removeFile(fileID: FileID) {
    fileStore.delete(fileID);
    metrics.FILE_STORAGE_SIZE.dec();
    log.info(`Removed file '${fileID}' from file store`);
}

export function clearFilestore() {
    fileStore.clear();
    metrics.FILE_STORAGE_SIZE.set(0);
    log.info(`Cleared file store`);
}
