import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_coaching_screeningUpdateInput } from "../../../inputs/Project_coaching_screeningUpdateInput";
import { Project_coaching_screeningWhereUniqueInput } from "../../../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateProject_coaching_screeningArgs {
  @TypeGraphQL.Field(_type => Project_coaching_screeningUpdateInput, {
    nullable: false
  })
  data!: Project_coaching_screeningUpdateInput;

  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Project_coaching_screeningWhereUniqueInput;
}
