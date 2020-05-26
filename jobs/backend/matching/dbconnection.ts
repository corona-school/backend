import { EntityManager, Brackets } from "typeorm";
import { Pupil } from "../../../common/entity/Pupil";
import { Match } from "../../../common/entity/Match";
import { Student } from "../../../common/entity/Student";

async function getUnmatchedPupils(transactionManager: EntityManager) {
    const pupils = await transactionManager
        .createQueryBuilder()
        .select("p")
        .from(Pupil, "p")
        .where("p.active = :act", { act: true })
        .leftJoinAndSelect("p.matches", "m")
        .getMany();

    //TODO: if student is not active, that should be equal to a dissolved match!!!!

    //filter out all that have at least one not dissolved match
    const unmatchedPupils: Pupil[] = [];
    for (const p of pupils) {
        if ((await p.matches).some((m) => m.dissolved === false)) {
            //this one has a not dissolved match, so the pupil is matche
            continue;
        }
        unmatchedPupils.push(p);
    }

    return unmatchedPupils;
}

async function getUnmatchedAndVerifiedStudents(
    transactionManager: EntityManager
) {
    const students = await transactionManager
        .createQueryBuilder()
        .select("s")
        .from(Student, "s")
        .where("s.active = :act", { act: true })
        .innerJoin("s.screening", "screening")
        .where("screening.success = :succ", { succ: true })
        .leftJoinAndSelect("s.matches", "m")
        .getMany();

    //TODO: if pupil is not active, that should be equal to a dissolved match!!!!

    //go from start to end and remove those that have are matched now but had a dissolved match in the past
    const unmatchedAndVerifiedStudents: Student[] = [];
    for (const s of students) {
        if ((await s.matches).some((m) => m.dissolved === false)) {
            continue;
        }
        unmatchedAndVerifiedStudents.push(s);
    }

    return unmatchedAndVerifiedStudents;
}

export { getUnmatchedAndVerifiedStudents, getUnmatchedPupils };
