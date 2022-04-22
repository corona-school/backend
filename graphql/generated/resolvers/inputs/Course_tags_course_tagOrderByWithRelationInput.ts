import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseOrderByWithRelationInput } from "../inputs/CourseOrderByWithRelationInput";
import { Course_tagOrderByWithRelationInput } from "../inputs/Course_tagOrderByWithRelationInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_tags_course_tagOrderByWithRelationInput", {
  isAbstract: true
})
export class Course_tags_course_tagOrderByWithRelationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseTagId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => CourseOrderByWithRelationInput, {
    nullable: true
  })
  course?: CourseOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Course_tagOrderByWithRelationInput, {
    nullable: true
  })
  course_tag?: Course_tagOrderByWithRelationInput | undefined;
}
