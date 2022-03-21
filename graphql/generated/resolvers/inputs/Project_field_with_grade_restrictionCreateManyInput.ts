import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { project_field_with_grade_restriction_projectfield_enum } from "../../enums/project_field_with_grade_restriction_projectfield_enum";

@TypeGraphQL.InputType("Project_field_with_grade_restrictionCreateManyInput", {
  isAbstract: true
})
export class Project_field_with_grade_restrictionCreateManyInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => project_field_with_grade_restriction_projectfield_enum, {
    nullable: false
  })
  projectField!: "Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik";

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  min?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  max?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  studentId!: number;
}
