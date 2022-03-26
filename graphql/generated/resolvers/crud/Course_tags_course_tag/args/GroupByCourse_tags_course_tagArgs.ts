import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tags_course_tagOrderByInput } from "../../../inputs/Course_tags_course_tagOrderByInput";
import { Course_tags_course_tagScalarWhereWithAggregatesInput } from "../../../inputs/Course_tags_course_tagScalarWhereWithAggregatesInput";
import { Course_tags_course_tagWhereInput } from "../../../inputs/Course_tags_course_tagWhereInput";
import { Course_tags_course_tagScalarFieldEnum } from "../../../../enums/Course_tags_course_tagScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByCourse_tags_course_tagArgs {
  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereInput, {
    nullable: true
  })
  where?: Course_tags_course_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagOrderByInput], {
    nullable: true
  })
  orderBy?: Course_tags_course_tagOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"courseId" | "courseTagId">;

  @TypeGraphQL.Field(_type => Course_tags_course_tagScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Course_tags_course_tagScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
