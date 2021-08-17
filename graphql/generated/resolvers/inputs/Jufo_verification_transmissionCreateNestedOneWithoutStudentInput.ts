import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Jufo_verification_transmissionCreateOrConnectWithoutStudentInput } from "../inputs/Jufo_verification_transmissionCreateOrConnectWithoutStudentInput";
import { Jufo_verification_transmissionCreateWithoutStudentInput } from "../inputs/Jufo_verification_transmissionCreateWithoutStudentInput";
import { Jufo_verification_transmissionWhereUniqueInput } from "../inputs/Jufo_verification_transmissionWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Jufo_verification_transmissionCreateNestedOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Jufo_verification_transmissionCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Jufo_verification_transmissionCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereUniqueInput, {
    nullable: true
  })
  connect?: Jufo_verification_transmissionWhereUniqueInput | undefined;
}
