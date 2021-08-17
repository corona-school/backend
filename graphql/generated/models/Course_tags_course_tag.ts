import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Course } from "../models/Course";
import { Course_tag } from "../models/Course_tag";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Course_tags_course_tag {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  courseId!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  courseTagId!: number;

  course?: Course;

  course_tag?: Course_tag;
}
