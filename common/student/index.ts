import { student as Student } from '@prisma/client';
import { prisma } from '../prisma';
import { GraphQLContext } from '../../graphql/context';
import { isElevated } from '../../graphql/authentication';
import { shortenLastName } from '../pupil';

// Only admins, screeners and the student themselves get to see the full last name, everyone else only sees the initial
export function normalizeStudentLastName(student: { id: number; lastname: string }, context: GraphQLContext) {
    const isOwnerOrElevated = isElevated(context) || (context.user.studentId && context.user.studentId == student.id);
    return isOwnerOrElevated ? student.lastname : shortenLastName(student.lastname);
}

export async function updateCertificateOfConduct(student: Student, criminalRecord: boolean, dateOfIssue: Date, dateOfInspection: Date) {
    if (!student.active) {
        throw new Error('Student was deactivated. Trying to add certificate.');
    }

    await prisma.certificate_of_conduct.update({
        where: {
            studentId: student.id,
        },
        data: {
            criminalRecords: criminalRecord,
            dateOfInspection: dateOfInspection,
            dateOfIssue: dateOfIssue,
        },
    });
}
