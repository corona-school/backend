import { getLogger } from '../../common/logger/logger';
import { prisma } from '../prisma';
import { deactivateStudent } from '../student/activation';
import { getStudent } from '../../graphql/util';
import * as Notification from '../notification';
import { userForStudent } from '../user';
import { predictedHookActionDate } from '../notification';

const logger = getLogger('Certificate of Conduct');

export async function create(dateOfInspection: Date, dateOfIssue: Date, criminalRecords: boolean, studentId: number) {
    const student = await getStudent(studentId);
    const result = await prisma.certificate_of_conduct.create({
        data: {
            dateOfInspection: dateOfInspection,
            dateOfIssue: dateOfIssue,
            criminalRecords: criminalRecords,
            studentId: studentId,
        },
    });
    logger.info(`Certificate of Conduct (${result.id}) created\n`);
    await Notification.actionTaken(userForStudent(student), 'student_coc_updated', {
        date: dateOfIssue.toString(),
    });
    if (criminalRecords) {
        await deactivateStudent(student);
    }
}
