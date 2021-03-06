import * as moment from "moment-timezone";
import { Pupil } from "../../../../../common/entity/Pupil";
import { Student } from "../../../../../common/entity/Student";
import { ApiMatchingRestriction, ApiTuteeMatchingRestriction, ApiTutorMatchingRestriction } from "../../types/matching-restrictions";

/// The filter that should be applied to both pupils and students when filtering student or pupils according to specified matching restrictions
function parentMatchingRestrictionFilter(restriction: ApiMatchingRestriction): (t: Pupil | Student) => boolean {
    return (t: Pupil | Student) => {
        //on blocking list?
        if (restriction.blockingList?.some(e => e === t.email)) return false;

        //matching email address?
        if (restriction.emails?.every(e => e !== t.email)) return false;

        //matching state?
        if (restriction.state && restriction.state !== t.state) return false;

        //matching registration date
        if (restriction.registrationDate
            && (
                (restriction.registrationDate.min != null && moment(t.createdAt).isBefore(restriction.registrationDate.min))
                || (restriction.registrationDate.max != null && moment(t.createdAt).isAfter(restriction.registrationDate.max))
            )
        ) return false;

        //subject names
        if (restriction.subjectNames && t.getSubjectsFormatted().every(s => restriction.subjectNames.every(rs => rs.toLowerCase() !== s.name.toLowerCase()))) return false;

        //default is true
        return true;
    };
}

/// The filter function that should be applied if tutor matching restrictions are given and possible matching candidates should be filtered according to the specified matching restrictions.
export function tutorMatchingRestrictionFilter(restriction: ApiTutorMatchingRestriction): (t: Student) => boolean {
    return (t: Student) => {
        if (!parentMatchingRestrictionFilter(restriction)(t)) return false;

        //is intern?
        if (restriction.isIntern != null && restriction.isIntern !== t.isIntern()) return false;

        //default is true
        return true;
    };
}

/// The filter function that should be applied if tutee matching restrictions are given and possible matching candidates should be filtered according to the specified matching restrictions.
export function tuteeMatchingRestrictionFilter(restriction: ApiTuteeMatchingRestriction): (t: Pupil) => boolean {
    return (t: Pupil) => {
        if (!parentMatchingRestrictionFilter(restriction)(t)) return false;

        //matching priority?
        if (restriction.matchingPriority
            && (
                (restriction.matchingPriority.min != null && restriction.matchingPriority.min > t.matchingPriority)
                || (restriction.matchingPriority.max != null && t.matchingPriority > restriction.matchingPriority.max)
            )
        ) return false;

        //default to true
        return true;
    };
}