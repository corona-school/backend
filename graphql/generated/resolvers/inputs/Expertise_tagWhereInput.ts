import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagListRelationFilter } from "../inputs/Expert_data_expertise_tags_expertise_tagListRelationFilter";
import { IntFilter } from "../inputs/IntFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expertise_tagWhereInput {
  @TypeGraphQL.Field(_type => [Expertise_tagWhereInput], {
    nullable: true
  })
  AND?: Expertise_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expertise_tagWhereInput], {
    nullable: true
  })
  OR?: Expertise_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expertise_tagWhereInput], {
    nullable: true
  })
  NOT?: Expertise_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagListRelationFilter, {
    nullable: true
  })
  expert_data_expertise_tags_expertise_tag?: Expert_data_expertise_tags_expertise_tagListRelationFilter | undefined;
}
