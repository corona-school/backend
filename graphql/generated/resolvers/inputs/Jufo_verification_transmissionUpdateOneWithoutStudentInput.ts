import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Jufo_verification_transmissionCreateOrConnectWithoutStudentInput } from "../inputs/Jufo_verification_transmissionCreateOrConnectWithoutStudentInput";
import { Jufo_verification_transmissionCreateWithoutStudentInput } from "../inputs/Jufo_verification_transmissionCreateWithoutStudentInput";
import { Jufo_verification_transmissionUpdateWithoutStudentInput } from "../inputs/Jufo_verification_transmissionUpdateWithoutStudentInput";
import { Jufo_verification_transmissionUpsertWithoutStudentInput } from "../inputs/Jufo_verification_transmissionUpsertWithoutStudentInput";
import { Jufo_verification_transmissionWhereUniqueInput } from "../inputs/Jufo_verification_transmissionWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Jufo_verification_transmissionUpdateOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Jufo_verification_transmissionCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Jufo_verification_transmissionCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionUpsertWithoutStudentInput, {
    nullable: true
  })
  upsert?: Jufo_verification_transmissionUpsertWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereUniqueInput, {
    nullable: true
  })
  connect?: Jufo_verification_transmissionWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionUpdateWithoutStudentInput, {
    nullable: true
  })
  update?: Jufo_verification_transmissionUpdateWithoutStudentInput | undefined;
}
