import LogUserEvent from './LogUserEvent';
import LogType from './LogType';
import { student as Student } from '@prisma/client';

export default class CertificateRequestEvent extends LogUserEvent {
    constructor(student: Student, matchuuid: string) {
        super(LogType.CERTIFICATE_REQUEST, student, { uuid: matchuuid });
    }
}
