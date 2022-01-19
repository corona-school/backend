import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Remission_requestWhereInput } from "../../../inputs/Remission_requestWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyRemission_requestArgs {
  @TypeGraphQL.Field(_type => Remission_requestWhereInput, {
    nullable: true
  })
  where?: Remission_requestWhereInput | undefined;
}
