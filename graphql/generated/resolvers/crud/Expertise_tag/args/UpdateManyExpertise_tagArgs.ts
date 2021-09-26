import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expertise_tagUpdateManyMutationInput } from "../../../inputs/Expertise_tagUpdateManyMutationInput";
import { Expertise_tagWhereInput } from "../../../inputs/Expertise_tagWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyExpertise_tagArgs {
  @TypeGraphQL.Field(_type => Expertise_tagUpdateManyMutationInput, {
    nullable: false
  })
  data!: Expertise_tagUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Expertise_tagWhereInput, {
    nullable: true
  })
  where?: Expertise_tagWhereInput | undefined;
}
