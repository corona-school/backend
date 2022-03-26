import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestOrderByRelationAggregateInput } from "../inputs/Course_guestOrderByRelationAggregateInput";
import { Course_instructors_studentOrderByRelationAggregateInput } from "../inputs/Course_instructors_studentOrderByRelationAggregateInput";
import { Course_tags_course_tagOrderByRelationAggregateInput } from "../inputs/Course_tags_course_tagOrderByRelationAggregateInput";
import { StudentOrderByWithRelationInput } from "../inputs/StudentOrderByWithRelationInput";
import { SubcourseOrderByRelationAggregateInput } from "../inputs/SubcourseOrderByRelationAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("CourseOrderByWithRelationInput", {
  isAbstract: true
})
export class CourseOrderByWithRelationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  createdAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  updatedAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  name?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  outline?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  description?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  imageKey?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  category?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseState?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  screeningComment?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  publicRanking?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  allowContact?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  correspondentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => StudentOrderByWithRelationInput, {
    nullable: true
  })
  student?: StudentOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestOrderByRelationAggregateInput, {
    nullable: true
  })
  course_guest?: Course_guestOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentOrderByRelationAggregateInput, {
    nullable: true
  })
  course_instructors_student?: Course_instructors_studentOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagOrderByRelationAggregateInput, {
    nullable: true
  })
  course_tags_course_tag?: Course_tags_course_tagOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseOrderByRelationAggregateInput, {
    nullable: true
  })
  subcourse?: SubcourseOrderByRelationAggregateInput | undefined;
}
