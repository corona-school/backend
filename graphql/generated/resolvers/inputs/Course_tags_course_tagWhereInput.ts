import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseRelationFilter } from "../inputs/CourseRelationFilter";
import { Course_tagRelationFilter } from "../inputs/Course_tagRelationFilter";
import { IntFilter } from "../inputs/IntFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagWhereInput {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereInput], {
    nullable: true
  })
  AND?: Course_tags_course_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereInput], {
    nullable: true
  })
  OR?: Course_tags_course_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereInput], {
    nullable: true
  })
  NOT?: Course_tags_course_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  courseId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  courseTagId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => CourseRelationFilter, {
    nullable: true
  })
  course?: CourseRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_tagRelationFilter, {
    nullable: true
  })
  course_tag?: Course_tagRelationFilter | undefined;
}
