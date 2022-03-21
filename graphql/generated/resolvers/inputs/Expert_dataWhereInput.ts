import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { Enumexpert_data_allowed_enumFilter } from "../inputs/Enumexpert_data_allowed_enumFilter";
import { Expert_data_expertise_tags_expertise_tagListRelationFilter } from "../inputs/Expert_data_expertise_tags_expertise_tagListRelationFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";

@TypeGraphQL.InputType("Expert_dataWhereInput", {
  isAbstract: true
})
export class Expert_dataWhereInput {
  @TypeGraphQL.Field(_type => [Expert_dataWhereInput], {
    nullable: true
  })
  AND?: Expert_dataWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_dataWhereInput], {
    nullable: true
  })
  OR?: Expert_dataWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_dataWhereInput], {
    nullable: true
  })
  NOT?: Expert_dataWhereInput[] | undefined;

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
  contactEmail?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  description?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  active?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => Enumexpert_data_allowed_enumFilter, {
    nullable: true
  })
  allowed?: Enumexpert_data_allowed_enumFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  studentId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagListRelationFilter, {
    nullable: true
  })
  expert_data_expertise_tags_expertise_tag?: Expert_data_expertise_tags_expertise_tagListRelationFilter | undefined;
}
