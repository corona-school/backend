import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagWhereInput } from "../inputs/Expert_data_expertise_tags_expertise_tagWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagListRelationFilter {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereInput, {
    nullable: true
  })
  every?: Expert_data_expertise_tags_expertise_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereInput, {
    nullable: true
  })
  some?: Expert_data_expertise_tags_expertise_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereInput, {
    nullable: true
  })
  none?: Expert_data_expertise_tags_expertise_tagWhereInput | undefined;
}
