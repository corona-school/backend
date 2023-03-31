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

const userSelection = { id: true, firstname: true, lastname: true, email: true };

export function getUserTypeAndIdForUserId(userId: string): [type: UserTypes, id: number] {
    const validTypes = ['student', 'pupil', 'screener'];
    const [type, id] = userId.split('/');
    if (!validTypes.includes(type)) {
        throw Error('No valid user type found in user id');
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

// Enriches a Prisma Query with a filter to search users
// where: { AND: [originalWhere, userSearch("hello")]}

export function userSearch(search?: string): PrismaTypes.pupilWhereInput | PrismaTypes.studentWhereInput {
    if (!search) {
        return {};
    }

    // Unfortunately Prisma's fuzzy search capabilities are quite limited
    // c.f. https://github.com/prisma/prisma/issues/7986
    // Thus the following is non-fuzzy

    if (!search.includes(' ')) {
        // Only one word entered, could be email, firstname or lastname
        return {
            OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { firstname: { contains: search, mode: 'insensitive' } },
                { lastname: { contains: search, mode: 'insensitive' } },
            ],
        };
    } else {
        // Multiple words entered, probably name
        // We ignore middle names as they could be part of either first or lastname in the db
        const firstWord = search.slice(0, search.indexOf(' '));
        const lastWord = search.slice(search.lastIndexOf(' ') + 1);

        return {
            firstname: { contains: firstWord, mode: 'insensitive' },
            lastname: { contains: lastWord, mode: 'insensitive' },
        };
    }
}

// Enriches a Prisma Query with a filter to find users based on exact matches
// This should be used in cases where users are only allowed to see other users 'they know'
export function strictUserSearch(search?: string): PrismaTypes.pupilWhereInput | PrismaTypes.studentWhereInput {
    return {
        OR: [
            { email: { equals: search, mode: 'insensitive' } },
            {
                AND: [
                    { firstname: { equals: search.slice(0, search.indexOf(' ')), mode: 'insensitive' } },
                    { lastname: { equals: search.slice(search.indexOf(' ') + 1), mode: 'insensitive' } },
                ],
            },
        ],
    };
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

export async function updateUser(userId: string, email: string) {
    const user = await getUser(userId, /* active */ true);
    if (user.studentId) {
        await prisma.student.update({
            where: { id: user.studentId },
            data: { email: validateEmail(email) },
        });
    }
    if (user.pupilId) {
        await prisma.pupil.update({
            where: { id: user.pupilId },
            data: { email: validateEmail(email) },
        });
    }
}
