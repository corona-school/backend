import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseUpdateOneRequiredWithoutSubcourse_instructors_studentInput } from "../inputs/SubcourseUpdateOneRequiredWithoutSubcourse_instructors_studentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentUpdateWithoutStudentInput {
  @TypeGraphQL.Field(_type => SubcourseUpdateOneRequiredWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  subcourse?: SubcourseUpdateOneRequiredWithoutSubcourse_instructors_studentInput | undefined;
}
