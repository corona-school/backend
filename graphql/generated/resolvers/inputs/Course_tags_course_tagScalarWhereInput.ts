import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntFilter } from "../inputs/IntFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagScalarWhereInput {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarWhereInput], {
    nullable: true
  })
  AND?: Course_tags_course_tagScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarWhereInput], {
    nullable: true
  })
  OR?: Course_tags_course_tagScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarWhereInput], {
    nullable: true
  })
  NOT?: Course_tags_course_tagScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  courseId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  courseTagId?: IntFilter | undefined;
}
