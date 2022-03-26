import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { subcourse_instructors_studentSubcourseIdStudentIdCompoundUniqueInput } from "../inputs/subcourse_instructors_studentSubcourseIdStudentIdCompoundUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentWhereUniqueInput {
  @TypeGraphQL.Field(_type => subcourse_instructors_studentSubcourseIdStudentIdCompoundUniqueInput, {
    nullable: true
  })
  subcourseId_studentId?: subcourse_instructors_studentSubcourseIdStudentIdCompoundUniqueInput | undefined;
}
