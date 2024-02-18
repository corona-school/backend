import { getUser } from '../common/user';
import { Directive } from 'type-graphql';
import { prisma } from '../common/prisma';

/* Helpers to get Entities by their primary key */
export const getPupil = (pupilId: number) => prisma.pupil.findUniqueOrThrow({ where: { id: pupilId } });
export const getSubcourse = (subcourseId: number, includeLectures = false) =>
    prisma.subcourse.findUniqueOrThrow({ where: { id: subcourseId }, include: { lecture: includeLectures } });
export const getSubcoursesForCourse = (courseId: number, includeLectures = false) =>
    prisma.subcourse.findMany({ where: { courseId }, include: { lecture: includeLectures } });
export const getMatch = (matchId: number) => prisma.match.findUniqueOrThrow({ where: { id: matchId } });
export const getStudent = (studentId: number) => prisma.student.findUniqueOrThrow({ where: { id: studentId } });
export const getScreener = (screenerId: number) => prisma.screener.findUniqueOrThrow({ where: { id: screenerId } });
export const getCourse = (courseId: number) => prisma.course.findUniqueOrThrow({ where: { id: courseId } });
export const getLecture = (lectureId: number) => prisma.lecture.findUniqueOrThrow({ where: { id: lectureId } });

export const getUsers = (userIds: string[]) => Promise.all(userIds.map((userId) => getUser(userId)));

export function Deprecated(reason: string) {
    return Directive(`@deprecated(reason: "${reason}")`);
}

export function Doc(documentation: string) {
    return Directive(`""" ${documentation} """`);
}

/* GraphQL only has 'null values' whereas Prisma has dedicated semantics:
   - null means 'set to NULL'
   - undefined means 'do not change'
   Thus in a lot of cases we want to make sure that undefined is passed to Prisma
   (and never null) */
export function ensureNoNull<T>(value: T | null | undefined): T | undefined {
    if (value === null) {
        return undefined;
    }
    return value;
}

export function ensureNoNullObject<T>(value: T): { [K in keyof T]?: Exclude<T[K], null> } {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null)) as any;
}
