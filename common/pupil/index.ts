import { gradeAsInt } from "../util/gradestrings";
import { Pupil } from "../entity/Pupil";



export function getPupilGradeAsString(pupil: { grade: string | null }): string {
    return pupil.grade != null ? `${gradeAsInt(pupil.grade)}. Klasse` : "hat die Schule bereits abgeschlossen";
}