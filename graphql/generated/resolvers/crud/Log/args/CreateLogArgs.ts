import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogCreateInput } from "../../../inputs/LogCreateInput";

@TypeGraphQL.ArgsType()
export class CreateLogArgs {
  @TypeGraphQL.Field(_type => LogCreateInput, {
    nullable: false
  })
  data!: LogCreateInput;
}
