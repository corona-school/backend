import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningCreateWithoutStudentInput } from "../inputs/ScreeningCreateWithoutStudentInput";
import { ScreeningUpdateWithoutStudentInput } from "../inputs/ScreeningUpdateWithoutStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreeningUpsertWithoutStudentInput {
  @TypeGraphQL.Field(_type => ScreeningUpdateWithoutStudentInput, {
    nullable: false
  })
  update!: ScreeningUpdateWithoutStudentInput;

  @TypeGraphQL.Field(_type => ScreeningCreateWithoutStudentInput, {
    nullable: false
  })
  create!: ScreeningCreateWithoutStudentInput;
}
