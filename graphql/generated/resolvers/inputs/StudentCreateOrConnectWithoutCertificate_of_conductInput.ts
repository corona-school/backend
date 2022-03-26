import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCertificate_of_conductInput } from "../inputs/StudentCreateWithoutCertificate_of_conductInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutCertificate_of_conductInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutCertificate_of_conductInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCertificate_of_conductInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCertificate_of_conductInput;
}
