import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataWhereUniqueInput } from "../../../inputs/Expert_dataWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueExpert_dataArgs {
  @TypeGraphQL.Field(_type => Expert_dataWhereUniqueInput, {
    nullable: false
  })
  where!: Expert_dataWhereUniqueInput;
}
