import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchWhereUniqueInput } from "../../../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteProject_matchArgs {
  @TypeGraphQL.Field(_type => Project_matchWhereUniqueInput, {
    nullable: false
  })
  where!: Project_matchWhereUniqueInput;
}
