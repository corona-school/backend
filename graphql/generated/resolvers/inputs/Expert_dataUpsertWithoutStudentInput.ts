import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataCreateWithoutStudentInput } from "../inputs/Expert_dataCreateWithoutStudentInput";
import { Expert_dataUpdateWithoutStudentInput } from "../inputs/Expert_dataUpdateWithoutStudentInput";

@TypeGraphQL.InputType("Expert_dataUpsertWithoutStudentInput", {
  isAbstract: true
})
export class Expert_dataUpsertWithoutStudentInput {
  @TypeGraphQL.Field(_type => Expert_dataUpdateWithoutStudentInput, {
    nullable: false
  })
  update!: Expert_dataUpdateWithoutStudentInput;

  @TypeGraphQL.Field(_type => Expert_dataCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Expert_dataCreateWithoutStudentInput;
}
