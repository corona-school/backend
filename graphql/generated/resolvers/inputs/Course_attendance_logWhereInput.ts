import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { LectureRelationFilter } from "../inputs/LectureRelationFilter";
import { PupilRelationFilter } from "../inputs/PupilRelationFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_attendance_logWhereInput {
  @TypeGraphQL.Field(_type => [Course_attendance_logWhereInput], {
    nullable: true
  })
  AND?: Course_attendance_logWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logWhereInput], {
    nullable: true
  })
  OR?: Course_attendance_logWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logWhereInput], {
    nullable: true
  })
  NOT?: Course_attendance_logWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  attendedTime?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  ip?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  pupilId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  lectureId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => LectureRelationFilter, {
    nullable: true
  })
  lecture?: LectureRelationFilter | undefined;

  @TypeGraphQL.Field(_type => PupilRelationFilter, {
    nullable: true
  })
  pupil?: PupilRelationFilter | undefined;
}
