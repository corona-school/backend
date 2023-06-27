/* Long term we want to move away from the disjunct Pupil / Student relationship,
    towards a common User Entity. This module contains some steps towards that entity */

import { Pupil as TypeORMPupil } from '../entity/Pupil';
import { Student as TypeORMStudent } from '../entity/Student';
import { Screener as TypeORMScreener } from '../entity/Screener';

import { getManager } from 'typeorm';

import { pupil as Pupil, student as Student, screener as Screener } from '@prisma/client';
import { prisma } from '../prisma';
import { Prisma as PrismaTypes } from '@prisma/client';
import { validateEmail } from '../../graphql/validators';
import { updateZoomUser } from '../zoom/zoom-user';
import { isZoomFeatureActive } from '../zoom';

type Person = { id: number; isPupil?: boolean; isStudent?: boolean };

type UserTypes = 'student' | 'pupil' | 'screener';

/* IDs of pupils and students collide. Thus we need to generate a unique ID out of it
   Unfortunately we do not have a way to detect the database table a Prisma query returned from
   Thus for interoperability with Prisma we need to decide based on the fields available
   NOTE: isPupil can be false for Pupils and isStudent can be false for Students.
   The existence of the boolean is however tied to the respective entities */
export function isStudent(person: Person): boolean {
    return typeof person.isStudent === 'boolean';
}

export function isPupil(person: Person): boolean {
    return typeof person.isPupil === 'boolean';
}

export function getUserIdTypeORM(person: Person) {
    if (isStudent(person)) {
        return `student/${person.id}`;
    }

    if (isPupil(person)) {
        return `pupil/${person.id}`;
    }

    throw new Error(`Person was neither a Student or a Pupil`);
}

export async function getUserTypeORM(userID: string): Promise<TypeORMStudent | TypeORMPupil | TypeORMScreener | never> {
    const [type, id] = userID.split('/');
    const manager = getManager();
    if (type === 'student') {
        return await manager.findOneOrFail(TypeORMStudent, { where: { id } });
    }

    if (type === 'pupil') {
        return await manager.findOneOrFail(TypeORMPupil, { where: { id } });
    }

    if (type === 'screener') {
        return await manager.findOneOrFail(TypeORMScreener, { where: { id } });
    }
    throw new Error(`Unknown User(${userID})`);
}

export function getUserForTypeORM(user: Person) {
    if (isPupil(user)) {
        return userForPupil(user as TypeORMPupil);
    }

    if (isStudent(user)) {
        return userForStudent(user as TypeORMStudent);
    }

    throw new Error(`Unsupported user in getUserForTypeORM conversion`);
}
/* As Prisma values do not inherit an entity class but are plain objects,
   we need a wrapper around the different entities */
export type User = {
    userID: string;
    email: string;
    firstname: string;
    lastname: string;

    pupilId?: number;
    studentId?: number;
    screenerId?: number;
};

export const userSelection = { id: true, firstname: true, lastname: true, email: true };

export function getUserTypeAndIdForUserId(userId: string): [type: UserTypes, id: number] {
    const validTypes = ['student', 'pupil', 'screener', 'admin'];
    const [type, id] = userId.split('/');
    if (!validTypes.includes(type)) {
        throw Error('No valid user type found in user id: ' + type);
    }
    const parsedId = parseInt(id, 10);
    return [type as UserTypes, parsedId];
}

export async function getUser(userID: string, active?: boolean): Promise<User> {
    const [type, id] = getUserTypeAndIdForUserId(userID);

    if (type === 'student') {
        const student = await prisma.student.findFirst({ where: { id, active }, rejectOnNotFound: true, select: userSelection });
        if (student) {
            return userForStudent(student as Student);
        }
    }

    if (type === 'pupil') {
        const pupil = await prisma.pupil.findFirst({ where: { id, active }, rejectOnNotFound: true, select: userSelection });
        if (pupil) {
            return userForPupil(pupil as Pupil);
        }
    }

    if (type === 'screener') {
        const screener = await prisma.screener.findFirst({ where: { id, active }, rejectOnNotFound: true, select: userSelection });
        if (screener) {
            return userForScreener(screener as Screener);
        }
    }

    throw new Error(`Unknown User(${userID})`);
}

export async function getUserByEmail(email: string, active?: boolean): Promise<User> {
    const student = await prisma.student.findFirst({ where: { email, active }, select: userSelection });
    if (student) {
        return userForStudent(student as Student);
    }

    const pupil = await prisma.pupil.findFirst({ where: { email, active }, select: userSelection });
    if (pupil) {
        return userForPupil(pupil as Pupil);
    }

    const screener = await prisma.screener.findFirst({ where: { email, active }, select: userSelection });
    if (screener) {
        return userForScreener(screener as Screener);
    }

    throw new Error(`Unknown User(email: ${email})`);
}

export function userForPupil(pupil: Pupil | TypeORMPupil) {
    return userForType(pupil, 'pupil');
}

export function userForStudent(student: Student | TypeORMStudent) {
    return userForType(student, 'student');
}

export function userForScreener(screener: Screener | TypeORMScreener) {
    return userForType(screener, 'screener');
}

type userType = 'student' | 'pupil' | 'screener';
const userForType = (user: Pupil | Student | Screener | TypeORMPupil | TypeORMStudent | TypeORMScreener, type: userType): User => {
    return {
        userID: `${type}/${user.id}`,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        [`${type}Id`]: user.id,
    };
};

export function getFullName({ firstname, lastname }: { firstname?: string; lastname?: string }): string {
    if (!firstname) {
        return lastname;
    }

    if (!lastname) {
        return firstname;
    }

    return `${firstname} ${lastname}`;
}

export async function getStudent(user: User): Promise<Student | never> {
    if (!user.studentId) {
        throw new Error(`Expected User(${user.userID}) to be student`);
    }

    return await prisma.student.findUnique({ where: { id: user.studentId } });
}

export async function getPupil(user: User): Promise<Pupil | never> {
    if (!user.pupilId) {
        throw new Error(`Expected User(${user.userID}) to be pupil`);
    }

    return await prisma.pupil.findUnique({ where: { id: user.pupilId } });
}

type UserSelect = PrismaTypes.studentSelect & PrismaTypes.pupilSelect & PrismaTypes.screenerSelect;

export async function queryUser<Select extends UserSelect>(user: User, select: Select) {
    if (user.studentId) {
        return await prisma.student.findUnique({
            where: { id: user.studentId },
            select,
        });
    }

    if (user.pupilId) {
        return await prisma.pupil.findUnique({
            where: { id: user.pupilId },
            select,
        });
    }

    if (user.screenerId) {
        return await prisma.screener.findUnique({
            where: { id: user.screenerId },
            select,
        });
    }

    throw new Error(`Unknown User(${user.userID})`);
}

export async function updateUser(userId: string, { email }: Partial<Pick<User, 'email'>>) {
    const validatedEmail = validateEmail(email);
    const user = await getUser(userId, /* active */ true);
    if (user.studentId) {
        if (isZoomFeatureActive()) {
            await updateZoomUser(user);
        }

        return userForStudent(
            (await prisma.student.update({
                where: { id: user.studentId },
                data: { email: validatedEmail },
                select: userSelection,
            })) as Student
        );
    }
    if (user.pupilId) {
        return userForPupil(
            (await prisma.pupil.update({
                where: { id: user.pupilId },
                data: { email: validatedEmail },
                select: userSelection,
            })) as Pupil
        );
    }
}

export async function getUsers(userIds: User['userID'][]): Promise<User[]> {
    const pupilIds = [];
    const studentIds = [];
    userIds.forEach((userId) => {
        const [type, id] = getUserTypeAndIdForUserId(userId);
        if (type === 'pupil') {
            pupilIds.push(id);
        }
        if (type === 'student') {
            studentIds.push(id);
        }
    });
    const students = (
        await prisma.student.findMany({
            where: {
                id: {
                    in: studentIds,
                },
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
            },
        })
    ).map((p) => ({ ...p, isStudent: true, userID: getUserIdTypeORM({ ...p, isStudent: true }) }));

    const pupils = (
        await prisma.pupil.findMany({
            where: {
                id: {
                    in: pupilIds,
                },
            },

            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
            },
        })
    ).map((p) => ({ ...p, isPupil: true, userID: getUserIdTypeORM({ ...p, isPupil: true }) }));
    return [...students, ...pupils];
}

export async function updateLastLogin(user: User) {
    if (user.pupilId) {
        await prisma.pupil.update({ where: { id: user.pupilId }, data: { lastLogin: new Date() } });
    }
    if (user.studentId) {
        await prisma.student.update({ where: { id: user.pupilId }, data: { lastLogin: new Date() } });
    }
    if (user.screenerId) {
        await prisma.student.update({ where: { id: user.pupilId }, data: { lastLogin: new Date() } });
    }
}

export async function getStudentsFromList(userIDs: string[]) {
    const ids = userIDs.filter((it) => it.startsWith('student/')).map((it) => parseInt(it.split('/')[1], 10));
    return await prisma.student.findMany({
        where: { id: { in: ids } },
    });
}

export async function getPupilsFromList(userIDs: string[]) {
    const ids = userIDs.filter((it) => it.startsWith('pupil/')).map((it) => parseInt(it.split('/')[1], 10));
    return await prisma.pupil.findMany({
        where: { id: { in: ids } },
    });
}
