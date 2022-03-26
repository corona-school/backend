import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentUpdateOneRequiredWithoutSubcourse_instructors_studentInput } from "../inputs/StudentUpdateOneRequiredWithoutSubcourse_instructors_studentInput";

@TypeGraphQL.InputType("Subcourse_instructors_studentUpdateWithoutSubcourseInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentUpdateWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => StudentUpdateOneRequiredWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  student?: StudentUpdateOneRequiredWithoutSubcourse_instructors_studentInput | undefined;
}
