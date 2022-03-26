import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagListRelationFilter } from "../inputs/Course_tags_course_tagListRelationFilter";
import { IntFilter } from "../inputs/IntFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType("Course_tagWhereInput", {
  isAbstract: true
})
export class Course_tagWhereInput {
  @TypeGraphQL.Field(_type => [Course_tagWhereInput], {
    nullable: true
  })
  AND?: Course_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tagWhereInput], {
    nullable: true
  })
  OR?: Course_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tagWhereInput], {
    nullable: true
  })
  NOT?: Course_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  identifier?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  category?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagListRelationFilter, {
    nullable: true
  })
  course_tags_course_tag?: Course_tags_course_tagListRelationFilter | undefined;
}
