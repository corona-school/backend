import { gradeAsInt } from '../util/gradestrings';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { Role } from '../user/roles';
import { GraphQLContext } from '../../graphql/context';
import { isElevated } from '../../graphql/authentication';

export function getPupilGradeAsString(pupil: { grade: string | null }): string {
    return pupil.grade != null ? `${gradeAsInt(pupil.grade)}. Klasse` : 'hat die Schule bereits abgeschlossen';
}

export async function getParticipants(where: Prisma.pupilWhereInput) {
    const pupils = await prisma.pupil.findMany({
        select: { id: true, firstname: true, lastname: true, grade: true, schooltype: true, aboutMe: true, waiting_list_enrollment: true },
        where,
    });
    return pupils.map((pupil) => ({
        ...pupil,
        gradeAsInt: gradeAsInt(pupil.grade),
    }));
}

export function normalizeLastName(pupil: { id: number; lastname: string; age?: number }, context: GraphQLContext) {
    const isOwnerOrElevated = isElevated(context) || (context.user.pupilId && context.user.pupilId == pupil.id);
    if (isOwnerOrElevated || (pupil.age !== undefined && pupil.age >= 18)) {
        return pupil.lastname;
    } else {
        return shortenLastName(pupil.lastname);
    }
}

export const shortenLastName = (lastname: string) => {
    if (lastname.length > 0) {
        return lastname.charAt(0).concat('.');
    }
    return '';
};
