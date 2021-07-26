import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { FloatFilter } from "../inputs/FloatFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { PupilRelationFilter } from "../inputs/PupilRelationFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Participation_certificateWhereInput {
  @TypeGraphQL.Field(_type => [Participation_certificateWhereInput], {
    nullable: true
  })
  AND?: Participation_certificateWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateWhereInput], {
    nullable: true
  })
  OR?: Participation_certificateWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateWhereInput], {
    nullable: true
  })
  NOT?: Participation_certificateWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  uuid?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  subjects?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  categories?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  certificateDate?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  startDate?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  endDate?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => FloatFilter, {
    nullable: true
  })
  hoursPerWeek?: FloatFilter | undefined;

  @TypeGraphQL.Field(_type => FloatFilter, {
    nullable: true
  })
  hoursTotal?: FloatFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  medium?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  studentId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  pupilId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  ongoingLessons?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => PupilRelationFilter, {
    nullable: true
  })
  pupil?: PupilRelationFilter | undefined;

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;
}
