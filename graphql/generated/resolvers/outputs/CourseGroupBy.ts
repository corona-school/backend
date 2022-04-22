import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseAvgAggregate } from "../outputs/CourseAvgAggregate";
import { CourseCountAggregate } from "../outputs/CourseCountAggregate";
import { CourseMaxAggregate } from "../outputs/CourseMaxAggregate";
import { CourseMinAggregate } from "../outputs/CourseMinAggregate";
import { CourseSumAggregate } from "../outputs/CourseSumAggregate";
import { course_category_enum } from "../../enums/course_category_enum";
import { course_coursestate_enum } from "../../enums/course_coursestate_enum";

@TypeGraphQL.ObjectType("CourseGroupBy", {
  isAbstract: true
})
export class CourseGroupBy {
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
  imageKey!: string | null;

  @TypeGraphQL.Field(_type => course_category_enum, {
    nullable: false
  })
  category!: "revision" | "club" | "coaching";

  @TypeGraphQL.Field(_type => course_coursestate_enum, {
    nullable: false
  })
  courseState!: "created" | "submitted" | "allowed" | "denied" | "cancelled";

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  screeningComment!: string | null;

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
  correspondentId!: number | null;

  @TypeGraphQL.Field(_type => CourseCountAggregate, {
    nullable: true
  })
  _count!: CourseCountAggregate | null;

  @TypeGraphQL.Field(_type => CourseAvgAggregate, {
    nullable: true
  })
  _avg!: CourseAvgAggregate | null;

  @TypeGraphQL.Field(_type => CourseSumAggregate, {
    nullable: true
  })
  _sum!: CourseSumAggregate | null;

  @TypeGraphQL.Field(_type => CourseMinAggregate, {
    nullable: true
  })
  _min!: CourseMinAggregate | null;

  @TypeGraphQL.Field(_type => CourseMaxAggregate, {
    nullable: true
  })
  _max!: CourseMaxAggregate | null;
}
