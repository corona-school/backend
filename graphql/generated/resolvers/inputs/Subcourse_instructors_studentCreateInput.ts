import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutSubcourse_instructors_studentInput } from "../inputs/StudentCreateNestedOneWithoutSubcourse_instructors_studentInput";
import { SubcourseCreateNestedOneWithoutSubcourse_instructors_studentInput } from "../inputs/SubcourseCreateNestedOneWithoutSubcourse_instructors_studentInput";

@TypeGraphQL.InputType("Subcourse_instructors_studentCreateInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentCreateInput {
  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutSubcourse_instructors_studentInput, {
    nullable: false
  })
  student!: StudentCreateNestedOneWithoutSubcourse_instructors_studentInput;

  @TypeGraphQL.Field(_type => SubcourseCreateNestedOneWithoutSubcourse_instructors_studentInput, {
    nullable: false
  })
  subcourse!: SubcourseCreateNestedOneWithoutSubcourse_instructors_studentInput;
}
