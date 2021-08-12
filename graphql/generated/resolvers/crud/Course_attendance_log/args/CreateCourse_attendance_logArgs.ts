import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_attendance_logCreateInput } from "../../../inputs/Course_attendance_logCreateInput";

@TypeGraphQL.ArgsType()
export class CreateCourse_attendance_logArgs {
  @TypeGraphQL.Field(_type => Course_attendance_logCreateInput, {
    nullable: false
  })
  data!: Course_attendance_logCreateInput;
}
