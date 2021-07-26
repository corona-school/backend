import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_coaching_screeningUpdateManyMutationInput } from "../../../inputs/Project_coaching_screeningUpdateManyMutationInput";
import { Project_coaching_screeningWhereInput } from "../../../inputs/Project_coaching_screeningWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyProject_coaching_screeningArgs {
  @TypeGraphQL.Field(_type => Project_coaching_screeningUpdateManyMutationInput, {
    nullable: false
  })
  data!: Project_coaching_screeningUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereInput, {
    nullable: true
  })
  where?: Project_coaching_screeningWhereInput | undefined;
}
