import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInput", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  expertDataId!: number;
}
