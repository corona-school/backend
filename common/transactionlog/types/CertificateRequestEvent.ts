import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";

export default class CertificateRequestEvent extends LogUserEvent {
    constructor(student: Student, matchuuid: string) {
        super(LogType.CREATED_COURSE, student, { uuid: matchuuid });
    }
}
