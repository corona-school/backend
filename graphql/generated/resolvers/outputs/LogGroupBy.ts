import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LogAvgAggregate } from "../outputs/LogAvgAggregate";
import { LogCountAggregate } from "../outputs/LogCountAggregate";
import { LogMaxAggregate } from "../outputs/LogMaxAggregate";
import { LogMinAggregate } from "../outputs/LogMinAggregate";
import { LogSumAggregate } from "../outputs/LogSumAggregate";
import { log_logtype_enum } from "../../enums/log_logtype_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class LogGroupBy {
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

  @TypeGraphQL.Field(_type => LogCountAggregate, {
    nullable: true
  })
  _count!: LogCountAggregate | null;

  @TypeGraphQL.Field(_type => LogAvgAggregate, {
    nullable: true
  })
  _avg!: LogAvgAggregate | null;

  @TypeGraphQL.Field(_type => LogSumAggregate, {
    nullable: true
  })
  _sum!: LogSumAggregate | null;

  @TypeGraphQL.Field(_type => LogMinAggregate, {
    nullable: true
  })
  _min!: LogMinAggregate | null;

  @TypeGraphQL.Field(_type => LogMaxAggregate, {
    nullable: true
  })
  _max!: LogMaxAggregate | null;
}
