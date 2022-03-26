import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { project_field_with_grade_restrictionUQ_PROJECT_FIELDSCompoundUniqueInput } from "../inputs/project_field_with_grade_restrictionUQ_PROJECT_FIELDSCompoundUniqueInput";

@TypeGraphQL.InputType("Project_field_with_grade_restrictionWhereUniqueInput", {
  isAbstract: true
})
export class Project_field_with_grade_restrictionWhereUniqueInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

  @TypeGraphQL.Field(_type => project_field_with_grade_restrictionUQ_PROJECT_FIELDSCompoundUniqueInput, {
    nullable: true
  })
  UQ_PROJECT_FIELDS?: project_field_with_grade_restrictionUQ_PROJECT_FIELDSCompoundUniqueInput | undefined;
}
