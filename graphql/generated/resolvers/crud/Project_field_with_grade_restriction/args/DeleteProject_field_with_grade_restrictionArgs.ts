import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_field_with_grade_restrictionWhereUniqueInput } from "../../../inputs/Project_field_with_grade_restrictionWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteProject_field_with_grade_restrictionArgs {
  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionWhereUniqueInput, {
    nullable: false
  })
  where!: Project_field_with_grade_restrictionWhereUniqueInput;
}
