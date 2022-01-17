import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Remission_requestCreateInput } from "../../../inputs/Remission_requestCreateInput";
import { Remission_requestUpdateInput } from "../../../inputs/Remission_requestUpdateInput";
import { Remission_requestWhereUniqueInput } from "../../../inputs/Remission_requestWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertRemission_requestArgs {
  @TypeGraphQL.Field(_type => Remission_requestWhereUniqueInput, {
    nullable: false
  })
  where!: Remission_requestWhereUniqueInput;

  @TypeGraphQL.Field(_type => Remission_requestCreateInput, {
    nullable: false
  })
  create!: Remission_requestCreateInput;

  @TypeGraphQL.Field(_type => Remission_requestUpdateInput, {
    nullable: false
  })
  update!: Remission_requestUpdateInput;
}
