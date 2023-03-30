import { ModelsEnhanceMap, Pupil, ResolversEnhanceMap, Student, Subcourse, Course, Lecture, Course_tag as CourseTag, Concrete_notification } from './generated';
import { Authorized, createMethodDecorator } from 'type-graphql';
import { UNAUTHENTICATED_USER } from './authentication';

import { AuthChecker } from 'type-graphql';
import { GraphQLContext } from './context';
import assert from 'assert';
import { getLogger } from 'log4js';
import { isOwnedBy, ResolverModel, ResolverModelNames } from './ownership';
import { AuthenticationError, ForbiddenError } from './error';
import { isParticipant } from '../common/courses/participants';
import { getPupil } from './util';
import { Role } from '../common/user/roles';

/* -------------------------- AUTHORIZATION FRAMEWORK ------------------------------------------------------- */

export { Role } from './roles';

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

export async function hasAccess<Name extends ResolverModelNames>(context: GraphQLContext, modelName: Name, value: ResolverModel<Name>): Promise<void | never> {
    assert(context.deferredRequiredRoles, 'hasAccess may only be used in @AuthorizedDeferred methods');
    assert(await accessCheck(context, context.deferredRequiredRoles, modelName, value));
}

async function accessCheck(context: GraphQLContext, requiredRoles: Role[], modelName: ResolverModelNames | undefined, root: any) {
    if (requiredRoles.some((requiredRole) => context.user.roles.includes(requiredRole as Role))) {
        return true;
    }

    /* If the user could access this field if they are owning the entity,
       we have to compare the user to the root value of this resolver
       and use the ownership check */
    if (requiredRoles.includes(Role.OWNER)) {
        assert(modelName, 'Type must be resolved to determine ownership');
        assert(root, 'root value must be bound to determine ownership');

        const ownershipCheck = isOwnedBy[modelName];
        assert(!!ownershipCheck, `Entity ${modelName} must have ownership definition if Role.OWNER is used`);

        const isOwner = await ownershipCheck(context.user, root);
        authLogger.debug(`Ownership check, result: ${isOwner} for ${modelName}`, context.user, root);

        if (isOwner) {
            return true;
        }
    }
    if (requiredRoles.includes(Role.SUBCOURSE_PARTICIPANT)) {
        assert(modelName === 'Subcourse', 'Type must be a Subcourse to determine access to it');
        assert(root, 'root value must be bound to determine access');
        if (context.user.pupilId) {
            const pupil = await getPupil(context.user.pupilId);
            const success = await isParticipant(root, pupil);
            if (success) {
                return true;
            }
        }
    }

    if (context.user === UNAUTHENTICATED_USER) {
        throw new AuthenticationError(`Missing Roles as an unauthenticated user, did you forget to log in?`);
    }

    throw new ForbiddenError(`Requiring one of the following roles: ${requiredRoles}`);
}

/* ------------------------------ AUTHORIZATION ENHANCEMENTS -------------------------------------------------------- */

const allAdmin = { _all: [Authorized(Role.ADMIN)] };
const adminOrOwner = [Authorized(Role.ADMIN, Role.OWNER)];
const onlyAdmin = [Authorized(Role.ADMIN)];
const onlyOwner = [Authorized(Role.OWNER)];
const nobody = [Authorized(Role.NOBODY)];
const everyone = [Authorized(Role.UNAUTHENTICATED)];

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
    Expert_data: allAdmin,
    Expert_data_expertise_tags_expertise_tag: allAdmin,
    Expertise_tag: allAdmin,
    Instructor_screening: allAdmin,
    Jufo_verification_transmission: allAdmin,
    Mentor: allAdmin,
    Participation_certificate: allAdmin,
    Project_coaching_screening: allAdmin,
    Project_field_with_grade_restriction: allAdmin,
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
    Subcourse_instructors_student: allAdmin,
    Subcourse_participants_pupil: allAdmin,
    Subcourse_waiting_list_pupil: allAdmin,
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
    Certificate_of_conduct: allAdmin,
    Match_pool_run: allAdmin,
    Secret: { _all: nobody },
    Message_translation: { _all: nobody }, // Should always be accessed through Notification.messageTranslations
    Pupil_screening: allAdmin,
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
            | 'id'
            | 'firstname'
            | 'lastname'
            | 'active'
            | 'grade'
            | 'isJufoParticipant'
            | 'isParticipant'
            | 'isProjectCoachee'
            | 'isPupil'
            | 'languages'
            | 'projectFields'
            | 'aboutMe'
            | 'schooltype'
            | 'state'
        >({
            matchReason: everyone,
            authToken: nobody,
            authTokenSent: adminOrOwner,
            authTokenUsed: adminOrOwner,

            email: adminOrOwner,
            verification: nobody,
            verifiedAt: adminOrOwner,
            wix_id: adminOrOwner,
            newsletter: adminOrOwner,
            openMatchRequestCount: adminOrOwner,
            firstMatchRequest: adminOrOwner,
            openProjectMatchRequestCount: adminOrOwner,
            matchingPriority: adminOrOwner,
            learningGermanSince: adminOrOwner,
            createdAt: adminOrOwner,
            registrationSource: adminOrOwner,
            school: adminOrOwner,
            schoolId: adminOrOwner,
            teacherEmailAddress: adminOrOwner,
            coduToken: adminOrOwner,
            lastTimeCheckedNotifications: adminOrOwner,
            notificationPreferences: adminOrOwner,
            // these should look differently in a clean data model
            // by blacklisting them we prevent accidental usage
            lastUpdatedSettingsViaBlocker: nobody,
            msg: nobody,
            projectMemberCount: nobody,
            updatedAt: nobody,
            wix_creation_date: nobody,
            isRedacted: nobody,
            // these have cleaner variants in the data model:
            subjects: nobody, // -> subjectsFormatted
            pupil_screening: adminOrOwner,

            // these are associations which are wrongly in the TypeGraphQL generation
            // we do not have them enabled, also they are very technical and shall be replaced by semantic ones
            participation_certificate: nobody,
            project_match: nobody,
            pupil_tutoring_interest_confirmation_request: nobody,
            course_attendance_log: nobody,
            course_participation_certificate: nobody,
            subcourse_participants_pupil: nobody,
            subcourse_waiting_list_pupil: nobody,
            match: nobody,
            _count: nobody,
        }),
    },

    // ATTENTION: Student entities can be seen by other users, e.g. through the Match -> student edge
    Student: {
        fields: withPublicFields<
            Student,
            | 'id'
            | 'firstname'
            | 'lastname'
            | 'active'
            | 'isStudent'
            | 'isInstructor'
            | 'isProjectCoach'
            | 'isUniversityStudent'
            | 'languages'
            | 'aboutMe'
            | 'state'
        >({
            authToken: nobody,
            authTokenSent: adminOrOwner,
            authTokenUsed: adminOrOwner,

            email: adminOrOwner,
            phone: adminOrOwner,
            verification: nobody,
            verifiedAt: adminOrOwner,
            newsletter: adminOrOwner,
            openMatchRequestCount: adminOrOwner,
            firstMatchRequest: adminOrOwner,
            university: adminOrOwner,
            module: adminOrOwner,
            moduleHours: adminOrOwner,
            createdAt: adminOrOwner,
            openProjectMatchRequestCount: adminOrOwner,
            certificate_of_conduct: adminOrOwner,
            isCodu: adminOrOwner,
            registrationSource: adminOrOwner,
            lastTimeCheckedNotifications: adminOrOwner,
            notificationPreferences: adminOrOwner,

            // these have cleaner variants in the data model:
            subjects: nobody, // -> subjectsFormatted

            // these should look differently in a clean data model
            // by blacklisting them we prevent accidental usage
            msg: nobody,
            feedback: nobody,
            wasJufoParticipant: nobody,
            hasJufoCertificate: nobody,
            jufoPastParticipationConfirmed: nobody,
            jufoPastParticipationInfo: nobody,
            lastSentInstructorScreeningInvitationDate: nobody,
            lastSentJufoAlumniScreeningInvitationDate: nobody,
            lastSentScreeningInvitationDate: nobody,
            lastUpdatedSettingsViaBlocker: nobody,
            sentInstructorScreeningReminderCount: nobody,
            sentJufoAlumniScreeningReminderCount: nobody,
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
            project_coaching_screening: nobody,
            project_field_with_grade_restriction: nobody,
            project_match: nobody,
            subcourse_instructors_student: nobody,
            course: nobody,
            course_guest: nobody,
            course_instructors_student: nobody,
            course_participation_certificate: nobody,
            jufo_verification_transmission: nobody,
            expert_data: nobody,
            instructor_screening: nobody,
            remission_request: nobody,
            _count: nobody,
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
        >({
            course_participation_certificate: nobody,
            lecture: nobody,
            subcourse_instructors_student: nobody,
            subcourse_participants_pupil: nobody,
            subcourse_waiting_list_pupil: nobody,
            _count: nobody,
            alreadyPromoted: adminOrOwner,
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
        fields: withPublicFields<Lecture, 'id' | 'start' | 'duration' | 'createdAt' | 'updatedAt'>({
            course_attendance_log: nobody,
            subcourseId: nobody,
            subcourse: nobody,
            student: nobody,
            instructorId: nobody,
            _count: nobody,
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
        fields: withPublicFields<CourseTag, 'id' | 'name' | 'category'>({
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
            context: nobody,
            contextID: nobody,
            // Stack traces and error messages shall not be shown to users, we do not know what secret information they might contiain
            error: nobody,
        }),
    },
    Pupil_screening: {
        fields: {
            comment: onlyAdmin,
        },
    },
};
