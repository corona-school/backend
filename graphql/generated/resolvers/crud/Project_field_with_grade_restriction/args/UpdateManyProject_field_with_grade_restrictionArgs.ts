import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_field_with_grade_restrictionUpdateManyMutationInput } from "../../../inputs/Project_field_with_grade_restrictionUpdateManyMutationInput";
import { Project_field_with_grade_restrictionWhereInput } from "../../../inputs/Project_field_with_grade_restrictionWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyProject_field_with_grade_restrictionArgs {
  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionUpdateManyMutationInput, {
    nullable: false
  })
  data!: Project_field_with_grade_restrictionUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionWhereInput, {
    nullable: true
  })
  where?: Project_field_with_grade_restrictionWhereInput | undefined;
}
