import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_attendance_logOrderByInput } from "../../../inputs/Course_attendance_logOrderByInput";
import { Course_attendance_logScalarWhereWithAggregatesInput } from "../../../inputs/Course_attendance_logScalarWhereWithAggregatesInput";
import { Course_attendance_logWhereInput } from "../../../inputs/Course_attendance_logWhereInput";
import { Course_attendance_logScalarFieldEnum } from "../../../../enums/Course_attendance_logScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByCourse_attendance_logArgs {
  @TypeGraphQL.Field(_type => Course_attendance_logWhereInput, {
    nullable: true
  })
  where?: Course_attendance_logWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logOrderByInput], {
    nullable: true
  })
  orderBy?: Course_attendance_logOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "attendedTime" | "ip" | "pupilId" | "lectureId">;

  @TypeGraphQL.Field(_type => Course_attendance_logScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Course_attendance_logScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
