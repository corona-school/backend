import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tags_course_tagCreateManyInput } from "../../../inputs/Course_tags_course_tagCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyCourse_tags_course_tagArgs {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateManyInput], {
    nullable: false
  })
  data!: Course_tags_course_tagCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
