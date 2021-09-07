import { ResolversEnhanceMap } from "./generated";
import { Authorized } from "type-graphql";

import { AuthChecker } from "type-graphql";
import { GraphQLContext } from "./context";
import assert from "assert";
import { getLogger } from "log4js";
import { isOwnedBy, ResolverModelNames } from "./ownership";

export enum Role {
    /* Access via Retool */
    ADMIN = "ADMIN",
    /* Shortcut role for Screeners, Pupils and Students: */
    USER = "USER",
    /* Access via Screener Admin Interface */
    SCREENER = "SCREENER",
    /* Access via User Interface */
    PUPIL = "PUPIL",
    STUDENT = "STUDENT",
    /* Accessible to everyone */
    UNAUTHENTICATED = "UNAUTHENTICATED",
    /* User owns the entity as defined in graphql/ownership */
    OWNER = "OWNER"
}

const authLogger = getLogger("GraphQL Authentication");

export const authChecker: AuthChecker<GraphQLContext> = async ({ context, info }, requiredRoles) => {
    assert(requiredRoles.length, "Roles must be passed to AUTHORIZED");
    assert(requiredRoles.every(role => role in Role), "Roles must be of enum Role");


    if (!context.user || !context.user.roles) {
        return false;
    }

    if (requiredRoles.some(requiredRole => context.user.roles.includes(requiredRole as Role))) {
        return true;
    }

    /* If the user could access this field if they are owning the entity,
       we have to compare the user to the returnType
       and use the ownership check */
    if (requiredRoles.includes(Role.OWNER)) {
        assert(info.parentType, "Type must be resolved to determine ownership");

        const typeName = info.schema.getQueryType().name as ResolverModelNames;
        const ownershipCheck = isOwnedBy[typeName];
        assert(!!ownershipCheck, `Entity ${typeName} must have ownership definition if Role.OWNER is used`);

        const isOwner = await ownershipCheck(context.user, info.rootValue);
        authLogger.debug(`Ownership check, result: ${isOwner} for ${typeName}`, context.user, info.rootValue);

        if (isOwner) {
            return true;
        }
    }

    return false;
};

const allAdmin = { _all: [Authorized(Role.ADMIN)] };
const allAdminOrOwner = { _all: [Authorized(Role.ADMIN, Role.OWNER)] };

// Although we do not expose all Prisma entities, we make sure authorization is present for all of them
export const authorizationEnhanceMap: Required<ResolversEnhanceMap> = {
    Course: allAdmin,
    Pupil: allAdminOrOwner,
    Match: allAdminOrOwner,
    Lecture: allAdmin,
    Log: allAdmin,
    Subcourse: allAdmin,
    Student: allAdminOrOwner,
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
    Pupil_tutoring_interest_confirmation_request: allAdmin
};
