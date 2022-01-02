/* Long term we want to move away from the disjunct Pupil / Student relationship,
    towards a common User Entity. This module contains some steps towards that entity

  For most users registrations once happened via a third party application that generated UUIDs for the user (a wix_id)
  After moving away from that third party this was replaced by a collision-free UUID implementation
  As such the "wix_id" is actually a unique user ID across all users
  For newer entities, this field was rightfully named "userID"

*/

import { Pupil } from "../entity/Pupil";
import { Student } from "../entity/Student";
import { Mentor } from "../entity/Mentor";
import { Screener } from "../entity/Screener";

import { getManager } from "typeorm";
import { prisma } from "../prisma";

type Person = { wix_id?: string, userID?: string, isPupil?: boolean, isStudent?: boolean };

type TypeORMPerson = Student | Pupil | Mentor /* | Screener */; // TODO: Reenable

/* Unfortunately the wix_id / userID does not know where the user entity came from.
   We would have to query all the different tables which would be a significant overhead as this is used quite often.
   For TypeORM we could check whether "person instanceof [Entity]"
   But for interoperability with Prisma we need to decide solely based on the fields available
   isPupil can be false for Pupils and isStudent can be false for Students,
    but the existence of the boolean is however tied to the respective entities */
export function isStudent(person: Person): boolean {
    return (typeof person.isStudent === "boolean");
}

export function isPupil(person: Person): boolean {
    return (typeof person.isPupil === "boolean");
}

export function getUserId(person: Person) {
    const userID = person.wix_id ?? person.userID;
    if (!userID) {
        throw new Error(`Failed to generate UserID for (userID: ${person.userID}, wix_id: ${person.wix_id})`);
    }
    return userID;
}

export async function getUserTypeORM(userID: string): Promise<TypeORMPerson | never> {
    const manager = getManager();

    // User entities are fetched in descending likelihood of a hit

    const user = (
        (await manager.findOne(Pupil, { where: { wix_id: userID }})) ??
        (await manager.findOne(Student, { where: { wix_id: userID }})) ??
        (await manager.findOne(Mentor, { where: { wix_id: userID }})) ??
        (await manager.findOne(Screener, { where: { userID }}))
    );

    if (user) {
        return user;
    }

    throw new Error(`Unknown User(${userID})`);
}

export async function getUser(userID: string) {
    const user = (
        (await prisma.pupil.findUnique({ where: { wix_id: userID }, rejectOnNotFound: false })) ??
        (await prisma.student.findUnique({ where: { wix_id: userID }, rejectOnNotFound: false })) ??
        (await prisma.mentor.findUnique({ where: { wix_id: userID }, rejectOnNotFound: false })) ??
        (await prisma.screener.findUnique({ where: { userID }, rejectOnNotFound: false }))
    );

    if (user) {
        return user;
    }

    throw new Error(`Unknown User(${userID})`);
}



export function getFullName({ firstname, lastname }: { firstname?: string, lastname?: string }): string {
    if (!firstname) {
        return lastname;
    }

    if (!lastname) {
        return firstname;
    }

    return `${firstname} ${lastname}`;
}