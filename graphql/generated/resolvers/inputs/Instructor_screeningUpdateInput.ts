import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { NullableStringFieldUpdateOperationsInput } from "../inputs/NullableStringFieldUpdateOperationsInput";
import { ScreenerUpdateOneWithoutInstructor_screeningInput } from "../inputs/ScreenerUpdateOneWithoutInstructor_screeningInput";
import { StudentUpdateOneWithoutInstructor_screeningInput } from "../inputs/StudentUpdateOneWithoutInstructor_screeningInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Instructor_screeningUpdateInput {
  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  success?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  comment?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  knowsCoronaSchoolFrom?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerUpdateOneWithoutInstructor_screeningInput, {
    nullable: true
  })
  screener?: ScreenerUpdateOneWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateOneWithoutInstructor_screeningInput, {
    nullable: true
  })
  student?: StudentUpdateOneWithoutInstructor_screeningInput | undefined;
}
