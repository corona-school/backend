import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { course_category_enum } from "../../enums/course_category_enum";
import { course_coursestate_enum } from "../../enums/course_coursestate_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class CourseMaxAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  name!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  outline!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  imageKey!: string | null;

  @TypeGraphQL.Field(_type => course_category_enum, {
    nullable: true
  })
  category!: "revision" | "club" | "coaching" | null;

  @TypeGraphQL.Field(_type => course_coursestate_enum, {
    nullable: true
  })
  courseState!: "created" | "submitted" | "allowed" | "denied" | "cancelled" | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  screeningComment!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  publicRanking!: number | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  allowContact!: boolean | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  correspondentId!: number | null;
}
