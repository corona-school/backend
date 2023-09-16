/* eslint-disable import/no-cycle */
import { InstructorScreening } from '../entity/InstructorScreening';
import { ProjectCoachingScreening } from '../entity/ProjectCoachingScreening';
import { Screening } from '../entity/Screening';

export type AnyScreening = Screening | InstructorScreening | ProjectCoachingScreening;

export type ScreeningInfo = {
    verified: boolean;
    comment?: string;
    knowsCoronaSchoolFrom?: string;
};

export function screeningInfoFrom(screening: AnyScreening): ScreeningInfo | undefined {
    if (!screening) {
        return undefined;
    }

    return {
        verified: screening.success,
        comment: screening.comment,
        knowsCoronaSchoolFrom: screening.knowsCoronaSchoolFrom,
    };
}

export function hasRequiredScreeningInfo(s: ScreeningInfo) {
    return (
        typeof s.verified === 'boolean' &&
        ((s.comment ? typeof s.comment === 'string' : true) || (s.knowsCoronaSchoolFrom ? typeof s.knowsCoronaSchoolFrom === 'string' : true))
    );
}
