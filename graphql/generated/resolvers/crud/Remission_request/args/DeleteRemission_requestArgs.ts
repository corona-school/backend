import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Remission_requestWhereUniqueInput } from "../../../inputs/Remission_requestWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteRemission_requestArgs {
  @TypeGraphQL.Field(_type => Remission_requestWhereUniqueInput, {
    nullable: false
  })
  where!: Remission_requestWhereUniqueInput;
}
