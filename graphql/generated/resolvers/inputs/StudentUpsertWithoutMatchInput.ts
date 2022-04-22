import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutMatchInput } from "../inputs/StudentCreateWithoutMatchInput";
import { StudentUpdateWithoutMatchInput } from "../inputs/StudentUpdateWithoutMatchInput";

@TypeGraphQL.InputType("StudentUpsertWithoutMatchInput", {
  isAbstract: true
})
export class StudentUpsertWithoutMatchInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutMatchInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutMatchInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutMatchInput, {
    nullable: false
  })
  create!: StudentCreateWithoutMatchInput;
}
