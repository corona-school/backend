import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tags_course_tagUpdateInput } from "../../../inputs/Course_tags_course_tagUpdateInput";
import { Course_tags_course_tagWhereUniqueInput } from "../../../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateCourse_tags_course_tagArgs {
  @TypeGraphQL.Field(_type => Course_tags_course_tagUpdateInput, {
    nullable: false
  })
  data!: Course_tags_course_tagUpdateInput;

  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Course_tags_course_tagWhereUniqueInput;
}
