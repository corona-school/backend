import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCertificate_of_conductInput } from "../inputs/StudentCreateWithoutCertificate_of_conductInput";
import { StudentUpdateWithoutCertificate_of_conductInput } from "../inputs/StudentUpdateWithoutCertificate_of_conductInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpsertWithoutCertificate_of_conductInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutCertificate_of_conductInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutCertificate_of_conductInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCertificate_of_conductInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCertificate_of_conductInput;
}
