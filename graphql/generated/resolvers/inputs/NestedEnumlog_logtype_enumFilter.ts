import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { log_logtype_enum } from "../../enums/log_logtype_enum";

@TypeGraphQL.InputType("NestedEnumlog_logtype_enumFilter", {
  isAbstract: true
})
export class NestedEnumlog_logtype_enumFilter {
  @TypeGraphQL.Field(_type => log_logtype_enum, {
    nullable: true
  })
  equals?: "misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated" | "instructorIssuedCertificate" | "pupilInterestConfirmationRequestSent" | "pupilInterestConfirmationRequestReminderSent" | "pupilInterestConfirmationRequestStatusChange" | undefined;

  @TypeGraphQL.Field(_type => [log_logtype_enum], {
    nullable: true
  })
  in?: Array<"misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated" | "instructorIssuedCertificate" | "pupilInterestConfirmationRequestSent" | "pupilInterestConfirmationRequestReminderSent" | "pupilInterestConfirmationRequestStatusChange"> | undefined;

  @TypeGraphQL.Field(_type => [log_logtype_enum], {
    nullable: true
  })
  notIn?: Array<"misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated" | "instructorIssuedCertificate" | "pupilInterestConfirmationRequestSent" | "pupilInterestConfirmationRequestReminderSent" | "pupilInterestConfirmationRequestStatusChange"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumlog_logtype_enumFilter, {
    nullable: true
  })
  not?: NestedEnumlog_logtype_enumFilter | undefined;
}
