import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_field_with_grade_restrictionCreateInput } from "../../../inputs/Project_field_with_grade_restrictionCreateInput";

@TypeGraphQL.ArgsType()
export class CreateProject_field_with_grade_restrictionArgs {
  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionCreateInput, {
    nullable: false
  })
  data!: Project_field_with_grade_restrictionCreateInput;
}
