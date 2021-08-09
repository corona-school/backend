import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_field_with_grade_restrictionCreateManyInput } from "../../../inputs/Project_field_with_grade_restrictionCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyProject_field_with_grade_restrictionArgs {
  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionCreateManyInput], {
    nullable: false
  })
  data!: Project_field_with_grade_restrictionCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
