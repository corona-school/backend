import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseCreateInput } from "../../../inputs/CourseCreateInput";
import { CourseUpdateInput } from "../../../inputs/CourseUpdateInput";
import { CourseWhereUniqueInput } from "../../../inputs/CourseWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertCourseArgs {
  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: false
  })
  where!: CourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => CourseCreateInput, {
    nullable: false
  })
  create!: CourseCreateInput;

  @TypeGraphQL.Field(_type => CourseUpdateInput, {
    nullable: false
  })
  update!: CourseUpdateInput;
}
