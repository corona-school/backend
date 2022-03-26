import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentUpdateOneRequiredWithoutSubcourse_instructors_studentInput } from "../inputs/StudentUpdateOneRequiredWithoutSubcourse_instructors_studentInput";
import { SubcourseUpdateOneRequiredWithoutSubcourse_instructors_studentInput } from "../inputs/SubcourseUpdateOneRequiredWithoutSubcourse_instructors_studentInput";

@TypeGraphQL.InputType("Subcourse_instructors_studentUpdateInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentUpdateInput {
  @TypeGraphQL.Field(_type => StudentUpdateOneRequiredWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  student?: StudentUpdateOneRequiredWithoutSubcourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateOneRequiredWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  subcourse?: SubcourseUpdateOneRequiredWithoutSubcourse_instructors_studentInput | undefined;
}
