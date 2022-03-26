import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutSubcourse_instructors_studentInput } from "../inputs/StudentCreateNestedOneWithoutSubcourse_instructors_studentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentCreateWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutSubcourse_instructors_studentInput, {
    nullable: false
  })
  student!: StudentCreateNestedOneWithoutSubcourse_instructors_studentInput;
}
