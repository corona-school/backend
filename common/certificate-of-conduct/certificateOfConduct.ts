import { getLogger } from '../../common/logger/logger';
import { prisma } from '../prisma';
import { deactivateStudent } from '../student/activation';
import { getStudent } from '../../graphql/util';
import * as Notification from '../notification';
import { userForStudent } from '../user';
import moment from 'moment';
import { cancelRemissionRequest } from '../remission-request';

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
    logger.info(`Certificate of Conduct(${result.id}) created\n`);
    await Notification.actionTaken(userForStudent(student), 'student_coc_updated', {
        date: dateOfIssue.toString(),
    });
    if (criminalRecords) {
        await deactivateStudent(student);
    }
}

export async function attemptDeleteStaleCoC(studentId: number) {
    const student = await getStudent(studentId);
    const twoYearsAgo = moment().subtract(2, 'years').toDate();
    const existingCoC = await prisma.certificate_of_conduct.findFirst({
        where: {
            studentId: student.id,
            dateOfIssue: {
                lt: twoYearsAgo,
            },
        },
    });
    if (!existingCoC) {
        throw new Error('No valid Certificate of Conduct found to delete');
    }
    await prisma.certificate_of_conduct.delete({
        where: {
            studentId: student.id,
        },
    });
    await cancelRemissionRequest(student);
    logger.info(`Certificate of Conduct of Student(${student.id}) deleted`);
}

export async function checkExistence(studentId: number) {
    const student = await getStudent(studentId);
    const result = await prisma.certificate_of_conduct.findFirst({ where: { studentId: student.id } });
    if (result) {
        return true;
    } else {
        return false;
    }
}
