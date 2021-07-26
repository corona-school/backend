import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchWhereInput } from "../../../inputs/Project_matchWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyProject_matchArgs {
  @TypeGraphQL.Field(_type => Project_matchWhereInput, {
    nullable: true
  })
  where?: Project_matchWhereInput | undefined;
}
