import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateNestedOneWithoutSubcourse_waiting_list_pupilInput } from "../inputs/SubcourseCreateNestedOneWithoutSubcourse_waiting_list_pupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilCreateWithoutPupilInput {
  @TypeGraphQL.Field(_type => SubcourseCreateNestedOneWithoutSubcourse_waiting_list_pupilInput, {
    nullable: false
  })
  subcourse!: SubcourseCreateNestedOneWithoutSubcourse_waiting_list_pupilInput;
}
