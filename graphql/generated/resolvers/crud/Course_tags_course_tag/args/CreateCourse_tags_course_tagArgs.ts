import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tags_course_tagCreateInput } from "../../../inputs/Course_tags_course_tagCreateInput";

@TypeGraphQL.ArgsType()
export class CreateCourse_tags_course_tagArgs {
  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateInput, {
    nullable: false
  })
  data!: Course_tags_course_tagCreateInput;
}
