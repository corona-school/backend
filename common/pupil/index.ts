import { Pupil } from "../entity/Pupil";



export function getPupilGradeAsString(pupil: Pupil ): string {
   return pupil.gradeAsNumber() != null ? `${pupil.gradeAsNumber()}. Klasse` : "hat die Schule bereits abgeschlossen"
}