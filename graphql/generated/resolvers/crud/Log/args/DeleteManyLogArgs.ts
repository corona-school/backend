import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogWhereInput } from "../../../inputs/LogWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyLogArgs {
  @TypeGraphQL.Field(_type => LogWhereInput, {
    nullable: true
  })
  where?: LogWhereInput | undefined;
}
