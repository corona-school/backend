import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Remission_requestCreateInput } from "../../../inputs/Remission_requestCreateInput";

@TypeGraphQL.ArgsType()
export class CreateRemission_requestArgs {
  @TypeGraphQL.Field(_type => Remission_requestCreateInput, {
    nullable: false
  })
  data!: Remission_requestCreateInput;
}
