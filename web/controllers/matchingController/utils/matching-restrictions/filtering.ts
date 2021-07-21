import moment from "moment-timezone";
import { Pupil } from "../../../../../common/entity/Pupil";
import { Student } from "../../../../../common/entity/Student";
import { ApiMatchingRestriction, ApiTuteeMatchingRestriction, ApiTutorMatchingRestriction } from "../../types/matching-restrictions";

/// The filter that should be applied to both pupils and students when filtering student or pupils according to specified matching restrictions
function parentMatchingRestrictionFilter(restriction: ApiMatchingRestriction): (t: Pupil | Student) => boolean {
    return (t: Pupil | Student) => {
        //on blocking list?
        if (restriction.blockingList?.some(e => e.toLowerCase() === t.email.toLowerCase())) {
            return false;
        }

        //matching email address?
        if (restriction.emails?.every(e => e.toLowerCase() !== t.email.toLowerCase())) {
            return false;
        }

        //matching state?
        if (restriction.states?.every(s => s !== t.state)) {
            return false;
        }

        //matching registration date
        if (restriction.registrationDates?.every(rd => (
            (rd.min != null && moment(t.wix_creation_date).isBefore(rd.min)) || (rd.max != null && moment(t.wix_creation_date).isAfter(rd.max)))
        )) { return false; }

        //subject names
        if (restriction.subjectNames && t.getSubjectsFormatted().every(s => restriction.subjectNames.every(rs => rs.toLowerCase() !== s.name.toLowerCase()))) {
            return false;
        }

        //default is true
        return true;
    };
}

/// The filter function that should be applied if tutor matching restrictions are given and possible matching candidates should be filtered according to the specified matching restrictions.
export function tutorMatchingRestrictionFilter(restriction: ApiTutorMatchingRestriction): (t: Student) => boolean {
    return (t: Student) => {
        if (!parentMatchingRestrictionFilter(restriction)(t)) {
            return false;
        }

        //is intern?
        if (restriction.isIntern != null && restriction.isIntern !== t.isIntern()) {
            return false;
        }

        //default is true
        return true;
    };
}

/// The filter function that should be applied if tutee matching restrictions are given and possible matching candidates should be filtered according to the specified matching restrictions.
export function tuteeMatchingRestrictionFilter(restriction: ApiTuteeMatchingRestriction): (t: Pupil) => boolean {
    return (t: Pupil) => {
        if (!parentMatchingRestrictionFilter(restriction)(t)) {
            return false;
        }

        //matching priority?
        if (restriction.matchingPriorities?.every(mp => (
            (mp.min != null && mp.min > t.matchingPriority) || (mp.max != null && t.matchingPriority > mp.max))
        )) { return false; }

        //default to true
        return true;
    };
}