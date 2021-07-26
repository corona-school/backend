import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutJufo_verification_transmissionInput } from "../inputs/StudentCreateOrConnectWithoutJufo_verification_transmissionInput";
import { StudentCreateWithoutJufo_verification_transmissionInput } from "../inputs/StudentCreateWithoutJufo_verification_transmissionInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateNestedOneWithoutJufo_verification_transmissionInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutJufo_verification_transmissionInput, {
    nullable: true
  })
  create?: StudentCreateWithoutJufo_verification_transmissionInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutJufo_verification_transmissionInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutJufo_verification_transmissionInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
