import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_coaching_screeningCreateInput } from "../../../inputs/Project_coaching_screeningCreateInput";

@TypeGraphQL.ArgsType()
export class CreateProject_coaching_screeningArgs {
  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateInput, {
    nullable: false
  })
  data!: Project_coaching_screeningCreateInput;
}
