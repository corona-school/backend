import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseWhereUniqueInput } from "../../../inputs/CourseWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueCourseArgs {
  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: false
  })
  where!: CourseWhereUniqueInput;
}
