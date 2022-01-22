import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Remission_requestUpdateInput } from "../../../inputs/Remission_requestUpdateInput";
import { Remission_requestWhereUniqueInput } from "../../../inputs/Remission_requestWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateRemission_requestArgs {
  @TypeGraphQL.Field(_type => Remission_requestUpdateInput, {
    nullable: false
  })
  data!: Remission_requestUpdateInput;

  @TypeGraphQL.Field(_type => Remission_requestWhereUniqueInput, {
    nullable: false
  })
  where!: Remission_requestWhereUniqueInput;
}
