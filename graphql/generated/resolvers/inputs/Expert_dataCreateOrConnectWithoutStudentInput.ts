import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataCreateWithoutStudentInput } from "../inputs/Expert_dataCreateWithoutStudentInput";
import { Expert_dataWhereUniqueInput } from "../inputs/Expert_dataWhereUniqueInput";

@TypeGraphQL.InputType("Expert_dataCreateOrConnectWithoutStudentInput", {
  isAbstract: true
})
export class Expert_dataCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => Expert_dataWhereUniqueInput, {
    nullable: false
  })
  where!: Expert_dataWhereUniqueInput;

  @TypeGraphQL.Field(_type => Expert_dataCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Expert_dataCreateWithoutStudentInput;
}
