import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutSubcourse_instructors_studentInput } from "../inputs/SubcourseCreateWithoutSubcourse_instructors_studentInput";
import { SubcourseUpdateWithoutSubcourse_instructors_studentInput } from "../inputs/SubcourseUpdateWithoutSubcourse_instructors_studentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseUpsertWithoutSubcourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => SubcourseUpdateWithoutSubcourse_instructors_studentInput, {
    nullable: false
  })
  update!: SubcourseUpdateWithoutSubcourse_instructors_studentInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutSubcourse_instructors_studentInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutSubcourse_instructors_studentInput;
}
