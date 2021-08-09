import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchCreateInput } from "../../../inputs/Project_matchCreateInput";

@TypeGraphQL.ArgsType()
export class CreateProject_matchArgs {
  @TypeGraphQL.Field(_type => Project_matchCreateInput, {
    nullable: false
  })
  data!: Project_matchCreateInput;
}
