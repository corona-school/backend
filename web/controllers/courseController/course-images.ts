import { join } from "path";
import { accessURLForKey } from "../../../common/file-bucket/s3";

export const COURSE_IMAGES_DEFAULT_PATH = "courses/images";
export const COURSE_IMAGE_DEFAULT_NAME = "cover";


export function courseImageKey(courseID: number, fileType: string) {
    return join(COURSE_IMAGES_DEFAULT_PATH, `${courseID}`, `${COURSE_IMAGE_DEFAULT_NAME}.${fileType}`);
}

export function courseImageURL(courseID: number, fileType: string) {
    accessURLForKey(courseImageKey(courseID, fileType));
}