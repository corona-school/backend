import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logListRelationFilter } from "../inputs/Course_attendance_logListRelationFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";
import { SubcourseRelationFilter } from "../inputs/SubcourseRelationFilter";

@TypeGraphQL.InputType("LectureWhereInput", {
  isAbstract: true
})
export class LectureWhereInput {
  @TypeGraphQL.Field(_type => [LectureWhereInput], {
    nullable: true
  })
  AND?: LectureWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureWhereInput], {
    nullable: true
  })
  OR?: LectureWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureWhereInput], {
    nullable: true
  })
  NOT?: LectureWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  start?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  duration?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  instructorId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  subcourseId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;

  @TypeGraphQL.Field(_type => SubcourseRelationFilter, {
    nullable: true
  })
  subcourse?: SubcourseRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logListRelationFilter, {
    nullable: true
  })
  course_attendance_log?: Course_attendance_logListRelationFilter | undefined;
}
