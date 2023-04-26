import LogUserEvent from './LogUserEvent';
import LogType from './LogType';
import { Student } from '../../entity/Student';

export default class CoCCancelledEvent extends LogUserEvent {
    constructor(student: { id: number; wix_id: string }) {
        super(LogType.COC_CANCEL, student, { studentId: student.id });
    }
}
