import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_field_with_grade_restrictionOrderByWithRelationInput } from "../../../inputs/Project_field_with_grade_restrictionOrderByWithRelationInput";
import { Project_field_with_grade_restrictionWhereInput } from "../../../inputs/Project_field_with_grade_restrictionWhereInput";
import { Project_field_with_grade_restrictionWhereUniqueInput } from "../../../inputs/Project_field_with_grade_restrictionWhereUniqueInput";
import { Project_field_with_grade_restrictionScalarFieldEnum } from "../../../../enums/Project_field_with_grade_restrictionScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class StudentProject_field_with_grade_restrictionArgs {
  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionWhereInput, {
    nullable: true
  })
  where?: Project_field_with_grade_restrictionWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Project_field_with_grade_restrictionOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionWhereUniqueInput, {
    nullable: true
  })
  cursor?: Project_field_with_grade_restrictionWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "projectField" | "min" | "max" | "studentId"> | undefined;
}
