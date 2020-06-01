import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Match } from '../../entity/Match';

export default class CertificateRequestEvent extends LogUserEvent {
    constructor(student: Student, match: Match) {
        super(LogType.CREATED_COURSE, student, { id: match.id });
    }
}
