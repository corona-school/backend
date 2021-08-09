import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_coaching_screeningWhereUniqueInput } from "../../../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueProject_coaching_screeningArgs {
  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Project_coaching_screeningWhereUniqueInput;
}
