import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_field_with_grade_restrictionWhereInput } from "../inputs/Project_field_with_grade_restrictionWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_field_with_grade_restrictionListRelationFilter {
  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionWhereInput, {
    nullable: true
  })
  every?: Project_field_with_grade_restrictionWhereInput | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionWhereInput, {
    nullable: true
  })
  some?: Project_field_with_grade_restrictionWhereInput | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionWhereInput, {
    nullable: true
  })
  none?: Project_field_with_grade_restrictionWhereInput | undefined;
}
