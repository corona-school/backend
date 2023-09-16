import { gradeAsInt } from '../util/gradestrings';

export function getPupilGradeAsString(pupil: { grade: string | null }): string {
    return pupil.grade != null ? `${gradeAsInt(pupil.grade)}. Klasse` : 'hat die Schule bereits abgeschlossen';
}
