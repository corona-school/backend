import { ResolversEnhanceMap } from "./generated";
import { Authorized } from "type-graphql";

import { AuthChecker } from "type-graphql";
import { GraphQLContext } from "./context";
import assert from "assert";
import { getLogger } from "log4js";

export enum Role {
    /* Access via Retool */
    ADMIN = "ADMIN"
}

const authLogger = getLogger("GraphQL Authorization");

export const authChecker: AuthChecker<GraphQLContext> = ({ context }, requiredRoles) => {
    assert(requiredRoles.length, "Roles must be passed to AUTHORIZED");
    assert(requiredRoles.every(role => role in Role), "Roles must be of enum Role");


    if (!context.user || !context.user.roles) {
        return false;
    }

    return requiredRoles.some(requiredRole => context.user.roles.includes(requiredRole as Role));
};

const allAdmin = { _all: [Authorized(Role.ADMIN)] };

// Although we do not expose all Prisma entities, we make sure authorization is present for all of them
export const authorizationEnhanceMap: Required<ResolversEnhanceMap> = {
    Course: allAdmin,
    Pupil: allAdmin,
    Match: allAdmin,
    Lecture: allAdmin,
    Log: allAdmin,
    Subcourse: allAdmin,
    Student: allAdmin,
    Screening: allAdmin,
    Screener: allAdmin,
    Project_match: allAdmin,
    Bbb_meeting: allAdmin,
    Course_attendance_log: allAdmin,
    Course_instructors_student: allAdmin,
    Course_tag: allAdmin,
    Course_tags_course_tag: allAdmin,
    Expert_data: allAdmin,
    Expert_data_expertise_tags_expertise_tag: allAdmin,
    Expertise_tag: allAdmin,
    Instructor_screening: allAdmin,
    Jufo_verification_transmission: allAdmin,
    Mentor: allAdmin,
    Participation_certificate: allAdmin,
    Project_coaching_screening: allAdmin,
    Project_field_with_grade_restriction: allAdmin,
    School: allAdmin,
    Subcourse_instructors_student: allAdmin,
    Subcourse_participants_pupil: allAdmin,
    Subcourse_waiting_list_pupil: allAdmin,
    Concrete_notification: allAdmin,
    Course_guest: allAdmin,
    Course_participation_certificate: allAdmin,
    Notification: allAdmin,
    Pupil_tutoring_interest_confirmation_request: allAdmin,
    Certificate_of_conduct: allAdmin
};
