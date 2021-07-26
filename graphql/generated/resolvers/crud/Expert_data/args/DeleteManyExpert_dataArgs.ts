import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataWhereInput } from "../../../inputs/Expert_dataWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyExpert_dataArgs {
  @TypeGraphQL.Field(_type => Expert_dataWhereInput, {
    nullable: true
  })
  where?: Expert_dataWhereInput | undefined;
}
