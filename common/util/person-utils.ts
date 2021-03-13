import { EntityManager } from "typeorm";
import { Pupil } from "../entity/Pupil";
import { Student } from "../entity/Student";

export async function getPerson(emailAddr: string, manager: EntityManager, type: new () => Pupil | Student) {
    return await manager.findOne(type, {
        where: {
            active: true, //they need to be active
            email: emailAddr.toLowerCase()
        }
    });
}
export async function personExists(emailAddr: string, manager: EntityManager) {
    return await getPerson(emailAddr, manager, Pupil) != null || await getPerson(emailAddr, manager, Student) != null;
}