import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_attendance_logOrderByWithRelationInput } from "../../../inputs/Course_attendance_logOrderByWithRelationInput";
import { Course_attendance_logWhereInput } from "../../../inputs/Course_attendance_logWhereInput";
import { Course_attendance_logWhereUniqueInput } from "../../../inputs/Course_attendance_logWhereUniqueInput";
import { Course_attendance_logScalarFieldEnum } from "../../../../enums/Course_attendance_logScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class LectureCourse_attendance_logArgs {
  @TypeGraphQL.Field(_type => Course_attendance_logWhereInput, {
    nullable: true
  })
  where?: Course_attendance_logWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Course_attendance_logOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logWhereUniqueInput, {
    nullable: true
  })
  cursor?: Course_attendance_logWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "attendedTime" | "ip" | "pupilId" | "lectureId"> | undefined;
}
