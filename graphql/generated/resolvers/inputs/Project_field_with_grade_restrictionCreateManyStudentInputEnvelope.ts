import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_field_with_grade_restrictionCreateManyStudentInput } from "../inputs/Project_field_with_grade_restrictionCreateManyStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_field_with_grade_restrictionCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionCreateManyStudentInput], {
    nullable: false
  })
  data!: Project_field_with_grade_restrictionCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
