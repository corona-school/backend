import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchCreateInput } from "../../../inputs/Project_matchCreateInput";
import { Project_matchUpdateInput } from "../../../inputs/Project_matchUpdateInput";
import { Project_matchWhereUniqueInput } from "../../../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertProject_matchArgs {
  @TypeGraphQL.Field(_type => Project_matchWhereUniqueInput, {
    nullable: false
  })
  where!: Project_matchWhereUniqueInput;

  @TypeGraphQL.Field(_type => Project_matchCreateInput, {
    nullable: false
  })
  create!: Project_matchCreateInput;

  @TypeGraphQL.Field(_type => Project_matchUpdateInput, {
    nullable: false
  })
  update!: Project_matchUpdateInput;
}
