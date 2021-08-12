import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchOrderByInput } from "../../../inputs/Project_matchOrderByInput";
import { Project_matchWhereInput } from "../../../inputs/Project_matchWhereInput";
import { Project_matchWhereUniqueInput } from "../../../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateProject_matchArgs {
  @TypeGraphQL.Field(_type => Project_matchWhereInput, {
    nullable: true
  })
  where?: Project_matchWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Project_matchOrderByInput], {
    nullable: true
  })
  orderBy?: Project_matchOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_matchWhereUniqueInput, {
    nullable: true
  })
  cursor?: Project_matchWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
