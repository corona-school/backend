/* Long term we want to move away from the disjunct Pupil / Student relationship,
    towards a common User Entity. This module contains some steps towards that entity */

import { Person as TypeORMPerson } from "../entity/Person";
import { Pupil } from "../entity/Pupil";
import { Student } from "../entity/Student";
import { getManager } from "typeorm";

type Person = { id: number, isPupil?: boolean, isStudent?: boolean };

/* IDs of pupils and students collide. Thus we need to generate a unique ID out of it
   Unfortunately we do not have a way to detect the database table a Prisma query returned from
   Thus for interoperability with Prisma we need to decide based on the fields available
   NOTE: isPupil can be false for Pupils and isStudent can be false for Students.
   The existence of the boolean is however tied to the respective entities */
export function isStudent(person: Person): boolean {
    return (typeof person.isStudent === "boolean");
}

export function isPupil(person: Person): boolean {
    return (typeof person.isPupil === "boolean");
}

export function getUserId(person: Person) {
    if (isStudent(person)) {
        return `student/${person.id}`;
    }

    if (isPupil(person)) {
        return `pupil/${person.id}`;
    }

    throw new Error(`Person was neither a Student or a Pupil`);
}

export async function getUser(userID: string): Promise<TypeORMPerson | never> {
    const [type, id] = userID.split("/");
    const manager = getManager();
    if (type === "student") {
        return await manager.findOneOrFail(Student, { where: { id }});
    }

    if (type === "pupil") {
        return await manager.findOneOrFail(Pupil, { where: { id }});
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