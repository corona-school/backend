import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagWhereInput } from "../inputs/Course_tags_course_tagWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagListRelationFilter {
  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereInput, {
    nullable: true
  })
  every?: Course_tags_course_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereInput, {
    nullable: true
  })
  some?: Course_tags_course_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereInput, {
    nullable: true
  })
  none?: Course_tags_course_tagWhereInput | undefined;
}
