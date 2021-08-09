import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogWhereUniqueInput } from "../../../inputs/LogWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueLogArgs {
  @TypeGraphQL.Field(_type => LogWhereUniqueInput, {
    nullable: false
  })
  where!: LogWhereUniqueInput;
}
