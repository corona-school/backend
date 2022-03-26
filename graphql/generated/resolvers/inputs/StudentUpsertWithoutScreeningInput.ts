import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutScreeningInput } from "../inputs/StudentCreateWithoutScreeningInput";
import { StudentUpdateWithoutScreeningInput } from "../inputs/StudentUpdateWithoutScreeningInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpsertWithoutScreeningInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutScreeningInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutScreeningInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutScreeningInput, {
    nullable: false
  })
  create!: StudentCreateWithoutScreeningInput;
}
