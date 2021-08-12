import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchUpdateInput } from "../../../inputs/Project_matchUpdateInput";
import { Project_matchWhereUniqueInput } from "../../../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateProject_matchArgs {
  @TypeGraphQL.Field(_type => Project_matchUpdateInput, {
    nullable: false
  })
  data!: Project_matchUpdateInput;

  @TypeGraphQL.Field(_type => Project_matchWhereUniqueInput, {
    nullable: false
  })
  where!: Project_matchWhereUniqueInput;
}
