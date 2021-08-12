import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_coaching_screeningCreateInput } from "../../../inputs/Project_coaching_screeningCreateInput";
import { Project_coaching_screeningUpdateInput } from "../../../inputs/Project_coaching_screeningUpdateInput";
import { Project_coaching_screeningWhereUniqueInput } from "../../../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertProject_coaching_screeningArgs {
  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Project_coaching_screeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateInput, {
    nullable: false
  })
  create!: Project_coaching_screeningCreateInput;

  @TypeGraphQL.Field(_type => Project_coaching_screeningUpdateInput, {
    nullable: false
  })
  update!: Project_coaching_screeningUpdateInput;
}
