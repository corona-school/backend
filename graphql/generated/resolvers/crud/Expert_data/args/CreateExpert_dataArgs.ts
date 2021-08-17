import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataCreateInput } from "../../../inputs/Expert_dataCreateInput";

@TypeGraphQL.ArgsType()
export class CreateExpert_dataArgs {
  @TypeGraphQL.Field(_type => Expert_dataCreateInput, {
    nullable: false
  })
  data!: Expert_dataCreateInput;
}
