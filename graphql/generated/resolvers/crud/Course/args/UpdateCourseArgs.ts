import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseUpdateInput } from "../../../inputs/CourseUpdateInput";
import { CourseWhereUniqueInput } from "../../../inputs/CourseWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateCourseArgs {
  @TypeGraphQL.Field(_type => CourseUpdateInput, {
    nullable: false
  })
  data!: CourseUpdateInput;

  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: false
  })
  where!: CourseWhereUniqueInput;
}
