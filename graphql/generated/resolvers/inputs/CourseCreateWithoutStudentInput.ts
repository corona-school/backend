import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentCreateNestedManyWithoutCourseInput } from "../inputs/Course_instructors_studentCreateNestedManyWithoutCourseInput";
import { Course_tags_course_tagCreateNestedManyWithoutCourseInput } from "../inputs/Course_tags_course_tagCreateNestedManyWithoutCourseInput";
import { SubcourseCreateNestedManyWithoutCourseInput } from "../inputs/SubcourseCreateNestedManyWithoutCourseInput";
import { course_category_enum } from "../../enums/course_category_enum";
import { course_coursestate_enum } from "../../enums/course_coursestate_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseCreateWithoutStudentInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  outline!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  description!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  imageKey?: string | undefined;

  @TypeGraphQL.Field(_type => course_coursestate_enum, {
    nullable: true
  })
  courseState?: "created" | "submitted" | "allowed" | "denied" | "cancelled" | undefined;

  @TypeGraphQL.Field(_type => course_category_enum, {
    nullable: false
  })
  category!: "revision" | "club" | "coaching";

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  screeningComment?: string | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  publicRanking?: number | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  allowContact?: boolean | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentCreateNestedManyWithoutCourseInput, {
    nullable: true
  })
  course_instructors_student?: Course_instructors_studentCreateNestedManyWithoutCourseInput | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateNestedManyWithoutCourseInput, {
    nullable: true
  })
  course_tags_course_tag?: Course_tags_course_tagCreateNestedManyWithoutCourseInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateNestedManyWithoutCourseInput, {
    nullable: true
  })
  subcourse?: SubcourseCreateNestedManyWithoutCourseInput | undefined;
}
