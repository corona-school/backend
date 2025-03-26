import {
    ModelsEnhanceMap,
    Pupil,
    ResolversEnhanceMap,
    Student,
    Subcourse,
    Course,
    Lecture,
    Course_tag as CourseTag,
    Concrete_notification,
    Screener,
} from './generated';
import { Authorized, createMethodDecorator } from 'type-graphql';
import { UNAUTHENTICATED_USER } from './authentication';

import { AuthChecker } from 'type-graphql';
import { GraphQLContext } from './context';
import assert from 'assert';
import { getLogger } from '../common/logger/logger';
import { isOwnedBy, ResolverModel, ResolverModelNames } from './ownership';
import { AuthenticationError, ForbiddenError } from './error';
import { isMentor, isParticipant } from '../common/courses/participants';
import { getPupil, getStudent } from './util';
import { Role } from '../common/user/roles';
import { isDev, isTest } from '../common/util/environment';
import { isAppointmentParticipant } from '../common/appointment/participants';

/* -------------------------- AUTHORIZATION FRAMEWORK ------------------------------------------------------- */

export { Role } from './../common/user/roles';

const authLogger = getLogger('GraphQL Authentication');

/* The auth checker performs the authorization check for the @Authorized() annotation before the resolver runs
    It checks whether the user session created in graphql/context has all the roles required */
export const authChecker: AuthChecker<GraphQLContext> = async ({ context, info, root }, requiredRoles) => {
    assert(requiredRoles.length, 'Roles must be passed to AUTHORIZED');
    assert(
        requiredRoles.every((role) => role in Role),
        'Roles must be of enum Role'
    );
    assert(context.user?.roles, 'Roles must have been initialized in context');

    assert(await accessCheck(context, requiredRoles as Role[], info.parentType?.name as ResolverModelNames, root));

    return true; // or an error was thrown before
};

/* Inside mutations, determining Ownership is hard because the actual value is retrieved by it's primary key during
   mutation execution. Thus with AuthorizedDeferred one can move the access check into the mutation, and call
   hasAccess once the value is ready, like:

   @AuthorizedDeferred(Role.OWNER)
   courseCancel(@Ctx() context, @Arg() courseId: number) {
       const course = await getCourse(courseId);
       await hasAccess(context, "Course", course);
       // ...
   }

   Note that this leaks the information whether an entity exists, though as we use artificial primary keys this should not reveal
    anything of value
*/
export function AuthorizedDeferred(...requiredRoles: Role[]) {
    assert(requiredRoles.length, 'Roles must be passed to AUTHORIZED');

    return createMethodDecorator<GraphQLContext>(({ args, root, info, context }, next) => {
        context.deferredRequiredRoles = requiredRoles;
        return next();
    });
}

// We have a few entity dependent roles, where the role is determined based on the root entity of an edge, i.e.:
//    Subcourse(123)   --[ otherParticipants ]--> OtherParticipant(1)
//                       Role.SUBCOURSE_PARTICIPANT
// Thus when we arrive at the edge, we usually need to query the DB to check if the user is a participant of Subcourse 123
//
// However when the user arrived at the Subcourse via the subcoursesJoined edge, we know that they are a participant already,
//  as they own the pupil entity, the user is the pupil we depart from, and thus the user is a participant of all subcourses:
//    Pupil(1)   --[ subcoursesJoined ]  --> Subcourse(123)
//    Role.OWNER
// With this decorator, we can mark subcoursesJoined with @ImpliesRoleOnResult(Role.SUBCOURSE_PARTICIPANT, Role.OWNER),
//  and all subcourses returned by 'subcoursesJoined' will be marked with the respective role
// Then when the 'otherParticipants' edge is evaluated on each subcourse, we already know the role and can skip the access check
//
// This is a transparent optimization, so omitting ImpliesRoleOnResult will return the same results (however less fast)
export function ImpliesRoleOnResult(roleOnResult: Role, roleOnRoot: Role) {
    assert(
        entityRoles.some((it) => it.role === roleOnResult),
        'Only entity roles can be implied'
    );

    assert(
        entityRoles.some((it) => it.role === roleOnRoot),
        'Only entity roles can be implied'
    );

    return createMethodDecorator<GraphQLContext>(async ({ args, root, info, context }, next) => {
        // First evaluate all other decorators and the edge we are decorating:
        const result = await next();

        // Then check if we have the role on root ...
        const hasRoleOnRoot = getPreviouslyDeterminedEntityRole(context, roleOnRoot, root) === true;

        if (hasRoleOnRoot) {
            // ... and if yes, store the role on the target:
            if (Array.isArray(result)) {
                for (const it of result) {
                    storeDeterminedEntityRole(context, roleOnResult, it, true);
                }
            } else {
                storeDeterminedEntityRole(context, roleOnResult, result, true);
            }

            authLogger.debug(`Implied Role ` + roleOnResult + ` on result as user has role ` + roleOnRoot + ` on the current entity`);
        }

        return result;
    });
}

export async function hasAccess<Name extends ResolverModelNames>(context: GraphQLContext, modelName: Name, value: ResolverModel<Name>): Promise<void | never> {
    assert(context.deferredRequiredRoles, 'hasAccess may only be used in @AuthorizedDeferred methods');
    assert(await accessCheck(context, context.deferredRequiredRoles, modelName, value));
}

async function accessCheck(context: GraphQLContext, requiredRoles: Role[], modelName: ResolverModelNames | undefined, root: any) {
    if (requiredRoles.some((requiredRole) => context.user.roles.includes(requiredRole as Role))) {
        return true;
    }

    // If access is not granted by a fixed role of the user, they might have access through an 'entity role',
    // i.e. they are the owner of the accessed course or a participant in a course

    for (const entityRole of entityRoles) {
        if (requiredRoles.includes(entityRole.role)) {
            assert(root, 'root value must be bound to determine entity role ' + entityRole.role);
            assert(modelName, 'Type must be resolved to determine entity role ' + entityRole.role);

            const previousResult = getPreviouslyDeterminedEntityRole(context, entityRole.role, root);
            if (previousResult === true) {
                authLogger.debug('Skipped evaluating role ' + entityRole.role + ' as we know the user has this entity role');
                return true;
            }

            // We already know that the user cannot have this role, continue
            if (previousResult === false) {
                authLogger.debug('Skipped evaluating role ' + entityRole.role + ' as we know the user does not have this entity role');
                continue;
            }

            const result = await entityRole.hasRole(context, modelName, root);
            // As the accessCheck is evaluated in parallel on all edges from the same root node, it can happen that we still evaluate the same role multiple times,
            // and then store the result multiple times:
            storeDeterminedEntityRole(context, entityRole.role, root, result);
            // We short circuit here on the first found role that grants access
            if (result) {
                return true;
            }
        }
    }

    if (context.user === UNAUTHENTICATED_USER) {
        throw new AuthenticationError(`Missing Roles as an unauthenticated user, did you forget to log in?`);
    }

    throw new ForbiddenError(`Requiring one of the following roles: ${requiredRoles}`);
}

// An Entity Role is a role that a user has on all edges from a specific entity (root)
interface EntityRole {
    role: Role;
    hasRole(context: GraphQLContext, modelName: ResolverModelNames, root: any): Promise<boolean>;
}

// As we traverse multiple edges from the same entity, we might need to check the same entity roles for the same entity again,
// as these checks can be costly involving a roundtrip to the db, we cache the evaluated role in the GraphQL context

// undefined -> did not yet checked role
// true -> user has role on entity
// false -> user does not have role on entity
type EvaluatedEntityRoles = { [role in Role]?: boolean };
type RolesForEntities = Map<any /* root entity */, EvaluatedEntityRoles>;

const EVALUATED_ROLES = Symbol();

function getPreviouslyDeterminedEntityRole(context: GraphQLContext, role: Role, root: any): boolean | null {
    return (context[EVALUATED_ROLES] as RolesForEntities | undefined)?.get(root)?.[role] ?? null;
}

function storeDeterminedEntityRole(context: GraphQLContext, role: Role, root: any, hasRole: boolean) {
    const forEntities = (context[EVALUATED_ROLES] ?? (context[EVALUATED_ROLES] = new Map())) as RolesForEntities;
    let forEntity = forEntities.get(root);
    if (!forEntity) {
        forEntity = {};
        forEntities.set(root, forEntity);
    }

    forEntity[role] = hasRole;
    authLogger.debug(`Stored role ${role} on entity: ${hasRole}`);
}

const entityRoles: EntityRole[] = [
    {
        role: Role.OWNER,
        async hasRole(context, modelName, root) {
            const ownershipCheck = isOwnedBy[modelName];
            assert(!!ownershipCheck, `Entity ${modelName} must have ownership definition if Role.OWNER is used`);

            const isOwner = await ownershipCheck(context.user, root);
            authLogger.debug(`Ownership check, result: ${isOwner} for ${modelName}`, { root, user: context.user });

            return isOwner;
        },
    },

    {
        role: Role.SUBCOURSE_PARTICIPANT,
        async hasRole(context, modelName, root) {
            assert(modelName === 'Subcourse', 'Type must be a Subcourse to determine subcourse participant role');
            if (context.user.pupilId) {
                const pupil = await getPupil(context.user.pupilId);
                return await isParticipant(root, pupil);
            }
            return false;
        },
    },
    {
        role: Role.SUBCOURSE_MENTOR,
        async hasRole(context, modelName, root) {
            assert(modelName === 'Subcourse', 'Type must be a Subcourse to determine subcourse participant role');
            if (context.user.studentId) {
                const student = await getStudent(context.user.studentId);
                return await isMentor(root.id, student.id);
            }
            return false;
        },
    },
    {
        role: Role.APPOINTMENT_PARTICIPANT,
        async hasRole(context, modelName, root) {
            assert(modelName === 'Lecture', `Type must be a Lecture to determine access to it`);
            return await isAppointmentParticipant(root, context.user);
        },
    },
];

/* ------------------------------ AUTHORIZATION ENHANCEMENTS -------------------------------------------------------- */

const allAdmin = { _all: [Authorized(Role.ADMIN)] };
const adminOrOwner = [Authorized(Role.ADMIN, Role.OWNER)];
const adminOrOwnerOrScreener = [Authorized(Role.ADMIN, Role.OWNER, Role.SCREENER)];
const onlyAdmin = [Authorized(Role.ADMIN)];
const onlyAdminOrScreener = [Authorized(Role.ADMIN, Role.SCREENER)];
const onlyOwner = [Authorized(Role.OWNER)];
const nobody = [Authorized(Role.NOBODY)];
const everyone = [Authorized(Role.UNAUTHENTICATED)];
const participantOrOwnerOrAdmin = [Authorized(Role.ADMIN, Role.APPOINTMENT_PARTICIPANT, Role.OWNER)];
const subcourseParticipantOrOwner = [Authorized(Role.SUBCOURSE_PARTICIPANT, Role.SUBCOURSE_MENTOR, Role.OWNER)];

/* Utility to ensure that field authorizations are present except for the public fields listed */
const withPublicFields = <Entity = 'never', PublicFields extends keyof Entity = never>(otherFields: {
    [key in Exclude<keyof Entity, PublicFields>]: PropertyDecorator[];
}) => otherFields;

/* Although we do not expose all Prisma entities, we make sure authorization is present for all queries and mutations
   We use query and mutation authorizations as our main authorization strategy,
    as users usually have access to none or all fields.
    E.g. for pupils(take: 10) { id firstname } we do not check 10 times whether the user has access to id and firstname,
     but once whether he has access to "pupils".
    This however also means that through FieldResolver associations, one can leak user data in powerful ways,
     so always make sure to apply proper authorizations to those
*/
export const authorizationEnhanceMap: Required<ResolversEnhanceMap> = {
    Cooperation: allAdmin,
    Course: allAdmin,
    Pupil: allAdmin,
    Match: allAdmin,
    Lecture: allAdmin,
    Log: allAdmin,
    Subcourse: allAdmin,
    Student: allAdmin,
    Screening: allAdmin,
    Screener: allAdmin,
    Bbb_meeting: allAdmin,
    Course_attendance_log: allAdmin,
    Course_instructors_student: allAdmin,
    Course_tag: {
        course_tags: everyone,
        createOneCourse_tag: nobody,
        createManyCourse_tag: nobody,
        deleteManyCourse_tag: nobody,
        deleteOneCourse_tag: nobody,
        updateOneCourse_tag: nobody,
        updateManyCourse_tag: nobody,
        upsertOneCourse_tag: nobody,
    },
    Course_tags_course_tag: allAdmin,
    Attachment: allAdmin,
    Instructor_screening: allAdmin,
    Jufo_verification_transmission: allAdmin,
    Participation_certificate: allAdmin,
    Instant_certificate: allAdmin,
    Remission_request: allAdmin,
    School: {
        createOneSchool: adminOrOwner,
        deleteOneSchool: adminOrOwner,
        updateOneSchool: adminOrOwner,
        createManySchool: adminOrOwner,
        deleteManySchool: adminOrOwner,
        updateManySchool: adminOrOwner,
        // School data is public knowledge and can be queried by everyone
        schools: everyone,
    },
    Important_information: {
        createOneImportant_information: adminOrOwner,
        deleteOneImportant_information: adminOrOwner,
        updateOneImportant_information: adminOrOwner,
        createManyImportant_information: adminOrOwner,
        deleteManyImportant_information: adminOrOwner,
        updateManyImportant_information: adminOrOwner,
        important_informations: everyone,
    },
    Subcourse_promotion: allAdmin,
    Subcourse_instructors_student: allAdmin,
    Subcourse_mentors_student: allAdmin,
    Subcourse_participants_pupil: allAdmin,
    Concrete_notification: allAdmin,
    Course_guest: allAdmin,
    Course_participation_certificate: allAdmin,
    Notification: {
        notification: everyone,
        notifications: everyone,
        createManyNotification: nobody,
        deleteManyNotification: nobody,
        deleteOneNotification: nobody,
        createOneNotification: nobody,
        updateManyNotification: nobody,
        updateOneNotification: nobody,
        upsertOneNotification: nobody,
    },
    Pupil_tutoring_interest_confirmation_request: allAdmin,
    Push_subscription: allAdmin,
    Certificate_of_conduct: allAdmin,
    Match_pool_run: allAdmin,
    Secret: { _all: nobody },
    Message_translation: { _all: nobody },
    Pupil_screening: allAdmin,
    Waiting_list_enrollment: allAdmin,
    Achievement_template: allAdmin,
    User_achievement: allAdmin,
    Achievement_event: allAdmin,
    Job_run: { _all: nobody },
    Learning_assignment: allAdmin,
    Learning_note: allAdmin,
    Learning_topic: allAdmin,
};

/* Some entities are generally accessible by multiple users, however some fields of them are
   only supposed to be accessed by some users.
   By annotating the fields with extra checks, for every entity where the field is resolved the check is performed.
   Thus when running pupils(take: 10) { authToken } this will perform the ownership check for all 10 pupils retrieved
    (and will fail if one of them is not owned by the user)

   For various reasons query authorizations should be preferred, and field authorizations should only be used for
    extra sensitive data */
export const authorizationModelEnhanceMap: ModelsEnhanceMap = {
    // ATTENTION: Pupil entities can be seen by other users, e.g. through the Match -> pupil edge
    Pupil: {
        fields: withPublicFields<
            Pupil,
            'id' | 'firstname' | 'lastname' | 'active' | 'grade' | 'isParticipant' | 'isPupil' | 'languages' | 'aboutMe' | 'schooltype' | 'state'
        >({
            matchReason: everyone,

            email: adminOrOwnerOrScreener,
            verifiedAt: adminOrOwnerOrScreener,
            wix_id: adminOrOwner,
            newsletter: adminOrOwner,
            openMatchRequestCount: adminOrOwnerOrScreener,
            firstMatchRequest: adminOrOwnerOrScreener,
            matchingPriority: adminOrOwner,
            learningGermanSince: adminOrOwnerOrScreener,
            createdAt: adminOrOwnerOrScreener,
            registrationSource: adminOrOwnerOrScreener,
            school: adminOrOwnerOrScreener,
            schoolId: adminOrOwner,
            teacherEmailAddress: adminOrOwner,
            coduToken: adminOrOwner,
            lastTimeCheckedNotifications: adminOrOwner,
            notificationPreferences: adminOrOwner,
            // these should look differently in a clean data model
            // by blacklisting them we prevent accidental usage
            lastUpdatedSettingsViaBlocker: nobody,
            msg: nobody,
            updatedAt: nobody,
            wix_creation_date: nobody,
            isRedacted: nobody,
            // these have cleaner variants in the data model:
            subjects: nobody, // -> subjectsFormatted
            pupil_screening: adminOrOwner,

            // these are associations which are wrongly in the TypeGraphQL generation
            // we do not have them enabled, also they are very technical and shall be replaced by semantic ones
            participation_certificate: nobody,
            pupil_tutoring_interest_confirmation_request: nobody,
            course_attendance_log: nobody,
            course_participation_certificate: nobody,
            subcourse_participants_pupil: nobody,
            match: nobody,
            _count: nobody,
            waiting_list_enrollment: nobody,
            lastLogin: adminOrOwner,
            gradeUpdatedAt: adminOrOwner,
            learning_topics: adminOrOwner,
            descriptionForMatch: onlyAdminOrScreener,
            descriptionForScreening: onlyAdminOrScreener,
            hasSpecialNeeds: onlyAdminOrScreener,
            onlyMatchWith: onlyAdminOrScreener,
            referredById: adminOrOwner,
            emailOwner: adminOrOwnerOrScreener,
        }),
    },

    // ATTENTION: Student entities can be seen by other users, e.g. through the Match -> student edge
    Student: {
        fields: withPublicFields<
            Student,
            'id' | 'firstname' | 'lastname' | 'active' | 'isStudent' | 'isInstructor' | 'isUniversityStudent' | 'languages' | 'aboutMe' | 'state'
        >({
            email: adminOrOwnerOrScreener,
            phone: adminOrOwner,
            verifiedAt: adminOrOwner,
            newsletter: adminOrOwner,
            openMatchRequestCount: adminOrOwnerOrScreener,
            firstMatchRequest: adminOrOwnerOrScreener,
            university: adminOrOwnerOrScreener,
            createdAt: adminOrOwnerOrScreener,
            certificate_of_conduct: adminOrOwnerOrScreener,
            isCodu: adminOrOwner,
            registrationSource: adminOrOwnerOrScreener,
            lastTimeCheckedNotifications: adminOrOwner,
            notificationPreferences: adminOrOwner,

            // these have cleaner variants in the data model:
            subjects: nobody, // -> subjectsFormatted

            // these should look differently in a clean data model
            // by blacklisting them we prevent accidental usage
            msg: nobody,
            feedback: nobody,
            lastSentInstructorScreeningInvitationDate: nobody,
            lastSentScreeningInvitationDate: nobody,
            lastUpdatedSettingsViaBlocker: nobody,
            sentInstructorScreeningReminderCount: nobody,
            sentScreeningReminderCount: nobody,
            supportsInDaZ: nobody,
            updatedAt: nobody,
            wix_creation_date: nobody,
            wix_id: nobody,
            isRedacted: nobody,
            // these are associations which are wrongly in the TypeGraphQL generation
            // we do not have them enabled, also they are very technical and shall be replaced by semantic ones
            screening: nobody,
            lecture: nobody,
            match: nobody,
            participation_certificate: nobody,
            instant_certificate: nobody,
            subcourse_instructors_student: nobody,
            subcourse_mentors_student: nobody,
            course: nobody,
            course_guest: nobody,
            course_instructors_student: nobody,
            course_participation_certificate: nobody,
            jufo_verification_transmission: nobody,
            instructor_screening: nobody,
            remission_request: nobody,
            _count: nobody,
            zoomUserId: onlyAdmin,
            lastLogin: adminOrOwner,
            cooperation: everyone,
            cooperationID: nobody,
            hasDoneEthicsOnboarding: adminOrOwnerOrScreener,
            descriptionForMatch: onlyAdminOrScreener,
            hasSpecialExperience: onlyAdminOrScreener,
            gender: onlyAdminOrScreener,
            referredById: adminOrOwner,
            descriptionForScreening: onlyAdminOrScreener,
        }),
    },

    Screener: {
        fields: withPublicFields<Screener, 'id'>({
            password: nobody,
            verified: nobody,
            verifiedAt: nobody,
            instructor_screening: nobody,
            isRedacted: nobody,
            oldNumberID: nobody,
            screenings: nobody,
            updatedAt: nobody,
            _count: nobody,

            lastLogin: onlyOwner,
            lastTimeCheckedNotifications: onlyOwner,
            notificationPreferences: onlyOwner,

            is_trusted: onlyAdminOrScreener,
            is_course_screener: onlyAdminOrScreener,
            is_pupil_screener: onlyAdminOrScreener,
            is_student_screener: onlyAdminOrScreener,
            active: onlyAdminOrScreener,
            createdAt: onlyAdminOrScreener,
            firstname: onlyAdminOrScreener,
            lastname: onlyAdminOrScreener,
            email: onlyAdminOrScreener,
        }),
    },

    Subcourse: {
        fields: withPublicFields<
            Subcourse,
            | 'id'
            | 'published'
            | 'cancelled'
            | 'course'
            | 'courseId'
            | 'createdAt'
            | 'updatedAt'
            | 'publishedAt'
            | 'joinAfterStart'
            | 'minGrade'
            | 'maxGrade'
            | 'maxParticipants'
            | 'allowChatContactParticipants'
            | 'allowChatContactProspects'
            | 'groupChatType'
        >({
            course_participation_certificate: nobody,
            lecture: nobody,
            subcourse_instructors_student: nobody,
            subcourse_mentors_student: nobody,
            subcourse_participants_pupil: nobody,
            _count: nobody,
            alreadyPromoted: adminOrOwner,
            conversationId: subcourseParticipantOrOwner,
            waiting_list_enrollment: adminOrOwner,
            prospectChats: nobody,
            subcourse_promotions: onlyAdmin,
        }),
    },
    Course: {
        fields: withPublicFields<
            Course,
            | 'id'
            | 'name'
            | 'outline'
            | 'category'
            | 'subject'
            | 'schooltype'
            | 'allowContact'
            | 'courseState'
            | 'publicRanking'
            | 'description'
            | 'createdAt'
            | 'updatedAt'
            | 'shared'
        >({
            screeningComment: adminOrOwner,
            correspondentId: adminOrOwner,
            course_guest: nobody,
            course_instructors_student: nobody,
            course_tags_course_tag: nobody,
            subcourse: nobody,
            student: nobody,
            imageKey: nobody,
            _count: nobody,
        }),
    },
    Lecture: {
        fields: withPublicFields<
            Lecture,
            'id' | 'start' | 'duration' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'appointmentType' | 'isCanceled' | 'matchId' | 'subcourseId'
        >({
            course_attendance_log: nobody,
            // subcourseId: nobody,
            subcourse: nobody,
            student: nobody,
            instructorId: nobody,
            _count: nobody,
            match: adminOrOwner,
            // matchId: participantOrOwnerOrAdmin,
            participantIds: adminOrOwner,
            organizerIds: adminOrOwner,
            declinedBy: participantOrOwnerOrAdmin,
            zoomMeetingId: participantOrOwnerOrAdmin,
            zoomMeetingReport: adminOrOwner,
            override_meeting_link: participantOrOwnerOrAdmin,
        }),
    },
    Participation_certificate: {
        fields: {
            // these are Buffers and are not supposed to be retrieved directly by anyone (only rendered into a PDF)
            signatureParent: nobody,
            signaturePupil: nobody,
        },
    },
    Course_tag: {
        fields: withPublicFields<CourseTag, 'id' | 'name' | 'category' | 'active'>({
            identifier: nobody,
            _count: nobody,
            course_tags_course_tag: nobody,
        }),
    },
    Concrete_notification: {
        fields: withPublicFields<Concrete_notification, 'id' | 'userId' | 'notificationID' | 'sentAt' | 'state'>({
            attachmentGroupId: nobody,
            // The context might contain sensitivie information of other users for which we do not know whether the user should access those
            // Also there are sometimes tokens which users shall only access via E-Mail, as otherwise users can bypass email verification
            context: isDev || isTest ? onlyAdmin : nobody,
            contextID: isDev || isTest ? onlyAdmin : nobody,
            // Stack traces and error messages shall not be shown to users, we do not know what secret information they might contiain
            error: onlyAdmin,
            notification: adminOrOwner,
        }),
    },
    Pupil_screening: {
        fields: {
            comment: onlyAdminOrScreener,
        },
    },
};
