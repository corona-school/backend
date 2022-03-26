import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { expert_data_expertise_tags_expertise_tagExpertDataIdExpertiseTagIdCompoundUniqueInput } from "../inputs/expert_data_expertise_tags_expertise_tagExpertDataIdExpertiseTagIdCompoundUniqueInput";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagWhereUniqueInput", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagWhereUniqueInput {
  @TypeGraphQL.Field(_type => expert_data_expertise_tags_expertise_tagExpertDataIdExpertiseTagIdCompoundUniqueInput, {
    nullable: true
  })
  expertDataId_expertiseTagId?: expert_data_expertise_tags_expertise_tagExpertDataIdExpertiseTagIdCompoundUniqueInput | undefined;
}
