import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_instructors_studentCreateInput } from "../../../inputs/Course_instructors_studentCreateInput";

@TypeGraphQL.ArgsType()
export class CreateCourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Course_instructors_studentCreateInput, {
    nullable: false
  })
  data!: Course_instructors_studentCreateInput;
}
