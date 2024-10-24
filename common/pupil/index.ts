import { gradeAsInt } from '../util/gradestrings';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

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
