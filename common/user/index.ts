/* Long term we want to move away from the disjunct Pupil / Student relationship,
    towards a common User Entity. This module contains some steps towards that entity */

import { Pupil as TypeORMPupil } from '../entity/Pupil';
import { Student as TypeORMStudent } from '../entity/Student';
import { getManager } from 'typeorm';

import { pupil as Pupil, student as Student, screener as Screener } from '@prisma/client';
import { prisma } from '../prisma';
import assert from 'assert';
import { Prisma as PrismaTypes } from '@prisma/client';
import { query } from 'express';

type Person = { id: number; isPupil?: boolean; isStudent?: boolean };

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

export async function getUserTypeORM(userID: string): Promise<TypeORMStudent | TypeORMPupil | never> {
    const [type, id] = userID.split('/');
    const manager = getManager();
    if (type === 'student') {
        return await manager.findOneOrFail(TypeORMStudent, { where: { id } });
    }

    if (type === 'pupil') {
        return await manager.findOneOrFail(TypeORMPupil, { where: { id } });
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

export async function getUser(userID: string): Promise<User> {
    const [type, _id] = userID.split('/');
    const id = parseInt(_id, 10);

    if (type === 'student') {
        const student = await prisma.student.findUnique({ where: { id }, rejectOnNotFound: true, select: userSelection });
        return userForStudent(student);
    }

    if (type === 'pupil') {
        const pupil = await prisma.pupil.findUnique({ where: { id }, rejectOnNotFound: true, select: userSelection });
        return userForPupil(pupil);
    }

    if (type === 'screener') {
        const screener = await prisma.screener.findUnique({ where: { id }, rejectOnNotFound: true, select: userSelection });
        return userForScreener(screener);
    }

    throw new Error(`Unknown User(${userID})`);
}

export async function getUserByEmail(email: string): Promise<User> {
    const student = await prisma.student.findFirst({ where: { email }, select: userSelection });
    if (student) {
        return userForStudent(student);
    }

    const pupil = await prisma.pupil.findFirst({ where: { email }, select: userSelection });
    if (pupil) {
        return userForPupil(pupil);
    }

    const screener = await prisma.screener.findFirst({ where: { email }, select: userSelection });
    if (screener) {
        return userForScreener(screener);
    }

    throw new Error(`Unknown User(email: ${email})`);
}

export function userForPupil(pupil: Pick<Pupil, 'id' | 'firstname' | 'lastname' | 'email'>) {
    return {
        userID: `pupil/${pupil.id}`,
        firstname: pupil.firstname,
        lastname: pupil.lastname,
        email: pupil.email,
        pupilId: pupil.id,
    };
}

export function userForStudent(student: Pick<Student, 'id' | 'firstname' | 'lastname' | 'email'>) {
    return {
        userID: `student/${student.id}`,
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        studentId: student.id,
    };
}

export function userForScreener(screener: Pick<Screener, 'id' | 'firstname' | 'lastname' | 'email'>) {
    return {
        userID: `screener/${screener.id}`,
        firstname: screener.firstname,
        lastname: screener.lastname,
        email: screener.email,
        screenerId: screener.id,
    };
}

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
