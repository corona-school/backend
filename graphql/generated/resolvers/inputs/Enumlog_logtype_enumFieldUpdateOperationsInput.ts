import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { log_logtype_enum } from "../../enums/log_logtype_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumlog_logtype_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => log_logtype_enum, {
    nullable: true
  })
  set?: "misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated" | "instructorIssuedCertificate" | "pupilInterestConfirmationRequestSent" | "pupilInterestConfirmationRequestReminderSent" | "pupilInterestConfirmationRequestStatusChange" | undefined;
}
