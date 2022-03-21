import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { PupilUpdateOneWithoutCourse_participation_certificateInput } from "../inputs/PupilUpdateOneWithoutCourse_participation_certificateInput";
import { SubcourseUpdateOneWithoutCourse_participation_certificateInput } from "../inputs/SubcourseUpdateOneWithoutCourse_participation_certificateInput";

@TypeGraphQL.InputType("Course_participation_certificateUpdateWithoutStudentInput", {
  isAbstract: true
})
export class Course_participation_certificateUpdateWithoutStudentInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateOneWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  pupil?: PupilUpdateOneWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateOneWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  subcourse?: SubcourseUpdateOneWithoutCourse_participation_certificateInput | undefined;
}
