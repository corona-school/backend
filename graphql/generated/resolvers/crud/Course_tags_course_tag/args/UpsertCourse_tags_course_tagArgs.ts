import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tags_course_tagCreateInput } from "../../../inputs/Course_tags_course_tagCreateInput";
import { Course_tags_course_tagUpdateInput } from "../../../inputs/Course_tags_course_tagUpdateInput";
import { Course_tags_course_tagWhereUniqueInput } from "../../../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertCourse_tags_course_tagArgs {
  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Course_tags_course_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateInput, {
    nullable: false
  })
  create!: Course_tags_course_tagCreateInput;

  @TypeGraphQL.Field(_type => Course_tags_course_tagUpdateInput, {
    nullable: false
  })
  update!: Course_tags_course_tagUpdateInput;
}
