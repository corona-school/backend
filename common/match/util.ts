import { match as Match, pupil as Pupil, student as Student } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore The matching algorithm is optional, to allow for slim local setups
import type { SubjectWithGradeRestriction } from 'corona-school-matching';
import { prisma } from '../prisma';
import { parseSubjectString, Subject } from '../util/subjectsutils';
import { gradeAsInt } from '../util/gradestrings';
import { hashToken } from '../util/hashing';

export const DEFAULT_TUTORING_GRADERESTRICTIONS = {
    MIN: 1,
    MAX: 14,
};

export function formattedSubjectToSubjectWithGradeRestriction(subject: Subject): SubjectWithGradeRestriction {
    return {
        name: subject.name,
        gradeRestriction: {
            min: subject.grade?.min ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MIN, //due to a screening tool's bug (or how it is designed), those values may be null (which causes the algorithm to fail)
            max: subject.grade?.max ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MAX,
        },
    };
}

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
