import { GraphQLUser } from './authentication';
import { ResolversEnhanceMap } from './generated';
import type * as models from './generated/models';
import { prisma } from '../common/prisma';
import { User } from '../common/user';

/* ResolverModelNames is a union type of all Model classes, ResolverModel can then be used to refer to a class named as such */
export type ResolverModelNames = keyof typeof models;
export type ResolverModel<Name extends ResolverModelNames> = typeof models[Name]['prototype'];

/* If a user owns an entity, he has the Role.OWNER on that entity */
export const isOwnedBy: { [Name in ResolverModelNames]?: (user: GraphQLUser, entity: ResolverModel<Name>) => boolean | Promise<boolean> } & { [name: string]: (user: GraphQLUser, entity: any) => boolean | Promise<boolean> } = {
    Pupil: (user, pupil) => user.pupilId === pupil.id,
    Student: (user, student) => user.studentId === student.id,
    UserType: (sessionUser, user: User) => sessionUser.studentId === user.studentId && sessionUser.pupilId === user.pupilId && sessionUser.screenerId === user.screenerId,
    Course: async (user, course) => {
        if (!user.studentId) {
            return false;
        }
        const instructor = await prisma.course_instructors_student.findFirst({ where: { courseId: course.id, studentId: user.studentId } });
        return !!instructor;
    },
    Subcourse: async (user, subcourse) => {
        if (!user.studentId) {
            return false;
        }
        const instructor = await prisma.subcourse_instructors_student.findFirst({ where: { subcourseId: subcourse.id, studentId: user.studentId } });
        return !!instructor;
    },
    Match: (user, match) => user.pupilId === match.pupilId || user.studentId === match.studentId,
};
