import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Remission_requestCreateOrConnectWithoutStudentInput } from "../inputs/Remission_requestCreateOrConnectWithoutStudentInput";
import { Remission_requestCreateWithoutStudentInput } from "../inputs/Remission_requestCreateWithoutStudentInput";
import { Remission_requestWhereUniqueInput } from "../inputs/Remission_requestWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Remission_requestCreateNestedOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Remission_requestCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Remission_requestCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Remission_requestCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestWhereUniqueInput, {
    nullable: true
  })
  connect?: Remission_requestWhereUniqueInput | undefined;
}
