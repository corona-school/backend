import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Course_tags_course_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Course_tags_course_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Course_tags_course_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  courseId?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  courseTagId?: IntWithAggregatesFilter | undefined;
}
