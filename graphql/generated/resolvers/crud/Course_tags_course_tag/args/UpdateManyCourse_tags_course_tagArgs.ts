import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tags_course_tagUpdateManyMutationInput } from "../../../inputs/Course_tags_course_tagUpdateManyMutationInput";
import { Course_tags_course_tagWhereInput } from "../../../inputs/Course_tags_course_tagWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyCourse_tags_course_tagArgs {
  @TypeGraphQL.Field(_type => Course_tags_course_tagUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_tags_course_tagUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereInput, {
    nullable: true
  })
  where?: Course_tags_course_tagWhereInput | undefined;
}
