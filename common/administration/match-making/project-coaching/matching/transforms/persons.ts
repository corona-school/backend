import { PersonID } from "corona-school-matching";
import { Pupil } from "../../../../../entity/Pupil";
import { Student } from "../../../../../entity/Student";

export function transformPersonToPersonID(person: Student | Pupil): PersonID {
    return {
        uuid: person.wix_id
    };
}