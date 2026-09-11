import { User, userForPupil, userForStudent, userForScreener, userSelection } from '.';
import { Prisma, student as Student, pupil as Pupil, screener as Screener } from '@prisma/client';
import { prisma } from '../prisma';

// Enriches a Prisma Query with a filter to search users
// where: { AND: [originalWhere, userSearch("hello")]}

export function userSearch(search?: string): Prisma.pupilWhereInput & Prisma.studentWhereInput & Prisma.screenerWhereInput {
    if (!search) {
        return {};
    }

    // Unfortunately Prisma's fuzzy search capabilities are quite limited
    // c.f. https://github.com/prisma/prisma/issues/7986
    // Thus the following is non-fuzzy

    if (!search.includes(' ')) {
        // Only one word entered, could be email, firstname or lastname
        return {
            isRedacted: false,
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
            isRedacted: false,
            firstname: { contains: firstWord, mode: 'insensitive' },
            lastname: { contains: lastWord, mode: 'insensitive' },
        };
    }
}

// Enriches a Prisma Query with a filter to find users based on exact matches
// This should be used in cases where users are only allowed to see other users 'they know'
export function strictUserSearch(search?: string): Prisma.pupilWhereInput & Prisma.studentWhereInput & Prisma.screenerWhereInput {
    return {
        isRedacted: false,
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

export async function findUsers(search: string, only?: 'student' | 'pupil' | 'screener', take = 20, strict = false) {
    const result: User[] = [];

    async function find(where: Prisma.studentWhereInput & Prisma.pupilWhereInput & Prisma.screenerWhereInput) {
        if (!only || only === 'pupil') {
            const pupils = (await prisma.pupil.findMany({ where, take, select: userSelection, orderBy: { updatedAt: 'desc' } })) as Pupil[];
            result.push(...pupils.map(userForPupil));
        }

        if (!only || only === 'student') {
            const students = (await prisma.student.findMany({ where, take, select: userSelection, orderBy: { updatedAt: 'desc' } })) as Student[];
            result.push(...students.map(userForStudent));
        }

        if (!only || only === 'screener') {
            const screeners = (await prisma.screener.findMany({ where, take, select: userSelection, orderBy: { updatedAt: 'desc' } })) as Screener[];
            result.push(...screeners.map(userForScreener));
        }
    }

    search = search.trim();
    if (search.length < 2) {
        return [];
    }

    // Try to find exact matches first
    await find(strictUserSearch(search));
    if (result.length > 0) {
        return result;
    }

    if (!strict) {
        // Otherwise find inexact matches
        await find(userSearch(search));
    }

    return result;
}
