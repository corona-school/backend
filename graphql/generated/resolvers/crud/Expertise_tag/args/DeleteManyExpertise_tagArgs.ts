import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expertise_tagWhereInput } from "../../../inputs/Expertise_tagWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyExpertise_tagArgs {
  @TypeGraphQL.Field(_type => Expertise_tagWhereInput, {
    nullable: true
  })
  where?: Expertise_tagWhereInput | undefined;
}
