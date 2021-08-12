import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { StudentUpdateOneWithoutCourse_participation_certificateInput } from "../inputs/StudentUpdateOneWithoutCourse_participation_certificateInput";
import { SubcourseUpdateOneWithoutCourse_participation_certificateInput } from "../inputs/SubcourseUpdateOneWithoutCourse_participation_certificateInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_participation_certificateUpdateWithoutPupilInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateOneWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  student?: StudentUpdateOneWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateOneWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  subcourse?: SubcourseUpdateOneWithoutCourse_participation_certificateInput | undefined;
}
