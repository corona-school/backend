import { match as Match, pupil as Pupil, student as Student } from '@prisma/client';
import { prisma } from '../prisma';
import { parseSubjectString } from '../util/subjectsutils';
import { gradeAsInt } from '../util/gradestrings';
import { DEFAULT_TUTORING_GRADERESTRICTIONS } from '../entity/Student';
import { hashToken } from '../util/hashing';

export function getJitsiTutoringLink(match: Match) {
    return `https://meet.jit.si/CoronaSchool-${encodeURIComponent(match.uuid)}`;
}

export function getOverlappingSubjects(pupil: Pupil, student: Student) {
    const studentSubjects = parseSubjectString(student.subjects);
    const pupilSubjects = parseSubjectString(pupil.subjects);

    const tuteeGrade = pupil.grade === null ? null : gradeAsInt(pupil.grade);

    return pupilSubjects.filter((pupilSubject) =>
        studentSubjects.some(
            (studentSubject) =>
                studentSubject.name === pupilSubject.name &&
                (studentSubject.grade?.min ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MIN) <= tuteeGrade &&
                tuteeGrade <= (studentSubject.grade?.max ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MAX)
        )
    );
}

// Used for showing Questionnaires to users and associate the ones of a match
// Although it is not anonymous, this is at least pseudonymous and requires full database access
// Instead of using the id, some other unique fields are used to complicate attacks
export function getMatchHash(match: { createdAt: Date; uuid: string }) {
    return hashToken(`${match.createdAt}${match.uuid}`);
}

export async function canRemoveZoomLicense(studentId: any): Promise<boolean> {
    const prevDay = new Date();
    prevDay.setDate(prevDay.getDate() - 1);

    const matchesCount = await prisma.match.count({
        where: {
            studentId: studentId,
            dissolved: false,
        },
    });

    const subcourses = await prisma.subcourse.findMany({
        where: {
            subcourse_instructors_student: { some: { studentId: studentId } },
            lecture: { some: { start: { gte: prevDay } } },
        },
    });

    if (subcourses.length === 0 && matchesCount === 0) {
        return true;
    }

    return false;
}
