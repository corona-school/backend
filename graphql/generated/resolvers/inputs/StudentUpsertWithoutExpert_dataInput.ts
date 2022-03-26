import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutExpert_dataInput } from "../inputs/StudentCreateWithoutExpert_dataInput";
import { StudentUpdateWithoutExpert_dataInput } from "../inputs/StudentUpdateWithoutExpert_dataInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpsertWithoutExpert_dataInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutExpert_dataInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutExpert_dataInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutExpert_dataInput, {
    nullable: false
  })
  create!: StudentCreateWithoutExpert_dataInput;
}
