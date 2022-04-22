import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataCreateOrConnectWithoutStudentInput } from "../inputs/Expert_dataCreateOrConnectWithoutStudentInput";
import { Expert_dataCreateWithoutStudentInput } from "../inputs/Expert_dataCreateWithoutStudentInput";
import { Expert_dataWhereUniqueInput } from "../inputs/Expert_dataWhereUniqueInput";

@TypeGraphQL.InputType("Expert_dataCreateNestedOneWithoutStudentInput", {
  isAbstract: true
})
export class Expert_dataCreateNestedOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Expert_dataCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Expert_dataCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Expert_dataCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataWhereUniqueInput, {
    nullable: true
  })
  connect?: Expert_dataWhereUniqueInput | undefined;
}
