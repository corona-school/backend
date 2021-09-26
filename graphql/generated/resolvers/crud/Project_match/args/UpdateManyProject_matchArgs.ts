import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchUpdateManyMutationInput } from "../../../inputs/Project_matchUpdateManyMutationInput";
import { Project_matchWhereInput } from "../../../inputs/Project_matchWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyProject_matchArgs {
  @TypeGraphQL.Field(_type => Project_matchUpdateManyMutationInput, {
    nullable: false
  })
  data!: Project_matchUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Project_matchWhereInput, {
    nullable: true
  })
  where?: Project_matchWhereInput | undefined;
}
