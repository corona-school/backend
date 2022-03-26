import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { Enumschool_schooltype_enumFilter } from "../inputs/Enumschool_schooltype_enumFilter";
import { Enumschool_state_enumNullableFilter } from "../inputs/Enumschool_state_enumNullableFilter";
import { IntFilter } from "../inputs/IntFilter";
import { PupilListRelationFilter } from "../inputs/PupilListRelationFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";

@TypeGraphQL.InputType("SchoolWhereInput", {
  isAbstract: true
})
export class SchoolWhereInput {
  @TypeGraphQL.Field(_type => [SchoolWhereInput], {
    nullable: true
  })
  AND?: SchoolWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [SchoolWhereInput], {
    nullable: true
  })
  OR?: SchoolWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [SchoolWhereInput], {
    nullable: true
  })
  NOT?: SchoolWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  website?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  emailDomain?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => Enumschool_state_enumNullableFilter, {
    nullable: true
  })
  state?: Enumschool_state_enumNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Enumschool_schooltype_enumFilter, {
    nullable: true
  })
  schooltype?: Enumschool_schooltype_enumFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  activeCooperation?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => PupilListRelationFilter, {
    nullable: true
  })
  pupil?: PupilListRelationFilter | undefined;
}
