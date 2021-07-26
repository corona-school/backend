import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Course_instructors_student } from "../models/Course_instructors_student";
import { Course_tags_course_tag } from "../models/Course_tags_course_tag";
import { Student } from "../models/Student";
import { Subcourse } from "../models/Subcourse";
import { course_category_enum } from "../enums/course_category_enum";
import { course_coursestate_enum } from "../enums/course_coursestate_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Course {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

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
  imageKey?: string | null;

  @TypeGraphQL.Field(_type => course_coursestate_enum, {
    nullable: false
  })
  courseState!: "created" | "submitted" | "allowed" | "denied" | "cancelled";

  @TypeGraphQL.Field(_type => course_category_enum, {
    nullable: false
  })
  category!: "revision" | "club" | "coaching";

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  screeningComment?: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  publicRanking!: number;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  allowContact!: boolean;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  correspondentId?: number | null;

  student?: Student | null;

  course_instructors_student?: Course_instructors_student[];

  course_tags_course_tag?: Course_tags_course_tag[];

  subcourse?: Subcourse[];
}
