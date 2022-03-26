import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tags_course_tagOrderByInput } from "../../../inputs/Course_tags_course_tagOrderByInput";
import { Course_tags_course_tagWhereInput } from "../../../inputs/Course_tags_course_tagWhereInput";
import { Course_tags_course_tagWhereUniqueInput } from "../../../inputs/Course_tags_course_tagWhereUniqueInput";
import { Course_tags_course_tagScalarFieldEnum } from "../../../../enums/Course_tags_course_tagScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class Course_tagCourse_tags_course_tagArgs {
  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereInput, {
    nullable: true
  })
  where?: Course_tags_course_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagOrderByInput], {
    nullable: true
  })
  orderBy?: Course_tags_course_tagOrderByInput[] | undefined;

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

  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"courseId" | "courseTagId"> | undefined;
}
