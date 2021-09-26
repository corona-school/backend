import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { BoolNullableFilter } from "../inputs/BoolNullableFilter";
import { Certificate_of_conductListRelationFilter } from "../inputs/Certificate_of_conductListRelationFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { DateTimeNullableFilter } from "../inputs/DateTimeNullableFilter";
import { Instructor_screeningListRelationFilter } from "../inputs/Instructor_screeningListRelationFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { Project_coaching_screeningListRelationFilter } from "../inputs/Project_coaching_screeningListRelationFilter";
import { ScreeningListRelationFilter } from "../inputs/ScreeningListRelationFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerWhereInput {
  @TypeGraphQL.Field(_type => [ScreenerWhereInput], {
    nullable: true
  })
  AND?: ScreenerWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreenerWhereInput], {
    nullable: true
  })
  OR?: ScreenerWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreenerWhereInput], {
    nullable: true
  })
  NOT?: ScreenerWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  firstname?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  lastname?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  active?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  email?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  verification?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  verifiedAt?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  authToken?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  authTokenUsed?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  authTokenSent?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  password?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => BoolNullableFilter, {
    nullable: true
  })
  verified?: BoolNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  oldNumberID?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningListRelationFilter, {
    nullable: true
  })
  instructor_screening?: Instructor_screeningListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningListRelationFilter, {
    nullable: true
  })
  project_coaching_screening?: Project_coaching_screeningListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => ScreeningListRelationFilter, {
    nullable: true
  })
  screening?: ScreeningListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductListRelationFilter, {
    nullable: true
  })
  certificate_of_conduct?: Certificate_of_conductListRelationFilter | undefined;
}
