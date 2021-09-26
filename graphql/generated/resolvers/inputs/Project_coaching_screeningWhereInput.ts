import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { ScreenerRelationFilter } from "../inputs/ScreenerRelationFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_coaching_screeningWhereInput {
  @TypeGraphQL.Field(_type => [Project_coaching_screeningWhereInput], {
    nullable: true
  })
  AND?: Project_coaching_screeningWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningWhereInput], {
    nullable: true
  })
  OR?: Project_coaching_screeningWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningWhereInput], {
    nullable: true
  })
  NOT?: Project_coaching_screeningWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  success?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  comment?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  knowsCoronaSchoolFrom?: StringNullableFilter | undefined;

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
  screenerId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  studentId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => ScreenerRelationFilter, {
    nullable: true
  })
  screener?: ScreenerRelationFilter | undefined;

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;
}
