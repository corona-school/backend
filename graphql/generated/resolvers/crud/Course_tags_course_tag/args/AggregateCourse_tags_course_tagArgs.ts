import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tags_course_tagOrderByWithRelationInput } from "../../../inputs/Course_tags_course_tagOrderByWithRelationInput";
import { Course_tags_course_tagWhereInput } from "../../../inputs/Course_tags_course_tagWhereInput";
import { Course_tags_course_tagWhereUniqueInput } from "../../../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateCourse_tags_course_tagArgs {
  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereInput, {
    nullable: true
  })
  where?: Course_tags_course_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Course_tags_course_tagOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereUniqueInput, {
    nullable: true
  })
  cursor?: Course_tags_course_tagWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
