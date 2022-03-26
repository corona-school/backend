import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType("Course_tags_course_tagMinAggregate", {
  isAbstract: true
})
export class Course_tags_course_tagMinAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  courseId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  courseTagId!: number | null;
}
