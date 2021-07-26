import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseCreateInput } from "../../../inputs/CourseCreateInput";

@TypeGraphQL.ArgsType()
export class CreateCourseArgs {
  @TypeGraphQL.Field(_type => CourseCreateInput, {
    nullable: false
  })
  data!: CourseCreateInput;
}
