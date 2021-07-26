import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_attendance_logWhereUniqueInput } from "../../../inputs/Course_attendance_logWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteCourse_attendance_logArgs {
  @TypeGraphQL.Field(_type => Course_attendance_logWhereUniqueInput, {
    nullable: false
  })
  where!: Course_attendance_logWhereUniqueInput;
}
