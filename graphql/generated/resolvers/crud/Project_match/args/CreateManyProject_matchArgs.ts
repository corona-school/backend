import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchCreateManyInput } from "../../../inputs/Project_matchCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyProject_matchArgs {
  @TypeGraphQL.Field(_type => [Project_matchCreateManyInput], {
    nullable: false
  })
  data!: Project_matchCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
