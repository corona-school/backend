import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { log_logtype_enum } from "../enums/log_logtype_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Log {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => log_logtype_enum, {
    nullable: false
  })
  logtype!: "misc" | "verificationRequets" | "verified" | "matchDissolve" | "projectMatchDissolve" | "fetchedFromWix" | "deActivate" | "updatePersonal" | "updateSubjects" | "updateProjectFields" | "accessedByScreener" | "updatedByScreener" | "updateStudentDescription" | "createdCourse" | "certificateRequest" | "cancelledCourse" | "cancelledSubcourse" | "createdCourseAttendanceLog" | "contactMentor" | "bbbMeeting" | "contactExpert" | "participantJoinedCourse" | "participantLeftCourse" | "participantJoinedWaitingList" | "participantLeftWaitingList" | "userAccessedCourseWhileAuthenticated";

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  user!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  data!: string;
}
