import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Student } from "../models/Student";
import { project_field_with_grade_restriction_projectfield_enum } from "../enums/project_field_with_grade_restriction_projectfield_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Project_field_with_grade_restriction {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => project_field_with_grade_restriction_projectfield_enum, {
    nullable: false
  })
  projectField!: "Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik";

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  min?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  max?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  studentId!: number;

  student?: Student;
}
