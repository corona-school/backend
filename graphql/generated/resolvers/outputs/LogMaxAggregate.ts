import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { log_logtype_enum } from "../../enums/log_logtype_enum";

@TypeGraphQL.ObjectType("LogMaxAggregate", {
  isAbstract: true
})
export class LogMaxAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => log_logtype_enum, {
    nullable: true
  })
  logtype!: "misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated" | "instructorIssuedCertificate" | "pupilInterestConfirmationRequestSent" | "pupilInterestConfirmationRequestReminderSent" | "pupilInterestConfirmationRequestStatusChange" | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  user!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  data!: string | null;
}
