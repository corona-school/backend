import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_attendance_logUpdateInput } from "../../../inputs/Course_attendance_logUpdateInput";
import { Course_attendance_logWhereUniqueInput } from "../../../inputs/Course_attendance_logWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateCourse_attendance_logArgs {
  @TypeGraphQL.Field(_type => Course_attendance_logUpdateInput, {
    nullable: false
  })
  data!: Course_attendance_logUpdateInput;

  @TypeGraphQL.Field(_type => Course_attendance_logWhereUniqueInput, {
    nullable: false
  })
  where!: Course_attendance_logWhereUniqueInput;
}
