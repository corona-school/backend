import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagScalarWhereInput } from "../inputs/Expert_data_expertise_tags_expertise_tagScalarWhereInput";
import { Expert_data_expertise_tags_expertise_tagUpdateManyMutationInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagUpdateManyWithWhereWithoutExpertise_tagInput {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagScalarWhereInput, {
    nullable: false
  })
  where!: Expert_data_expertise_tags_expertise_tagScalarWhereInput;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagUpdateManyMutationInput, {
    nullable: false
  })
  data!: Expert_data_expertise_tags_expertise_tagUpdateManyMutationInput;
}
