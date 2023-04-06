import LogUserEvent from './LogUserEvent';
import LogType from './LogType';
import { Student } from '../../entity/Student';

export default class CertificateCancelledEvent extends LogUserEvent {
    constructor(student: { id: number; wix_id: string }) {
        super(LogType.CERTIFICATE_CANCEL, student, { studentId: student.id });
    }
}
