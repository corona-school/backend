import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateNestedOneWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseCreateNestedOneWithoutSubcourse_participants_pupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_participants_pupilCreateWithoutPupilInput {
  @TypeGraphQL.Field(_type => SubcourseCreateNestedOneWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  subcourse!: SubcourseCreateNestedOneWithoutSubcourse_participants_pupilInput;
}
