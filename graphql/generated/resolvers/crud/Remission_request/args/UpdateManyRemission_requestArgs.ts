import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Remission_requestUpdateManyMutationInput } from "../../../inputs/Remission_requestUpdateManyMutationInput";
import { Remission_requestWhereInput } from "../../../inputs/Remission_requestWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyRemission_requestArgs {
  @TypeGraphQL.Field(_type => Remission_requestUpdateManyMutationInput, {
    nullable: false
  })
  data!: Remission_requestUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Remission_requestWhereInput, {
    nullable: true
  })
  where?: Remission_requestWhereInput | undefined;
}
