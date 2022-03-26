import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInputEnvelope {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInput], {
    nullable: false
  })
  data!: Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
