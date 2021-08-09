import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_attendance_logCreateInput } from "../../../inputs/Course_attendance_logCreateInput";
import { Course_attendance_logUpdateInput } from "../../../inputs/Course_attendance_logUpdateInput";
import { Course_attendance_logWhereUniqueInput } from "../../../inputs/Course_attendance_logWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertCourse_attendance_logArgs {
  @TypeGraphQL.Field(_type => Course_attendance_logWhereUniqueInput, {
    nullable: false
  })
  where!: Course_attendance_logWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_attendance_logCreateInput, {
    nullable: false
  })
  create!: Course_attendance_logCreateInput;

  @TypeGraphQL.Field(_type => Course_attendance_logUpdateInput, {
    nullable: false
  })
  update!: Course_attendance_logUpdateInput;
}
