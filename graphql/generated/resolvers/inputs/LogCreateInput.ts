import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { log_logtype_enum } from "../../enums/log_logtype_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LogCreateInput {
  @TypeGraphQL.Field(_type => log_logtype_enum, {
    nullable: true
  })
  logtype?: "misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated" | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  user!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  data!: string;
}
