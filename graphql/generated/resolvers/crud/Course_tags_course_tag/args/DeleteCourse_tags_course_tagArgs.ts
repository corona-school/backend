import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tags_course_tagWhereUniqueInput } from "../../../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteCourse_tags_course_tagArgs {
  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Course_tags_course_tagWhereUniqueInput;
}
