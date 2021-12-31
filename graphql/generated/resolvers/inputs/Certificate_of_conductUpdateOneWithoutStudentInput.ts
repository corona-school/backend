import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductCreateOrConnectWithoutStudentInput } from "../inputs/Certificate_of_conductCreateOrConnectWithoutStudentInput";
import { Certificate_of_conductCreateWithoutStudentInput } from "../inputs/Certificate_of_conductCreateWithoutStudentInput";
import { Certificate_of_conductUpdateWithoutStudentInput } from "../inputs/Certificate_of_conductUpdateWithoutStudentInput";
import { Certificate_of_conductUpsertWithoutStudentInput } from "../inputs/Certificate_of_conductUpsertWithoutStudentInput";
import { Certificate_of_conductWhereUniqueInput } from "../inputs/Certificate_of_conductWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductUpdateOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Certificate_of_conductCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Certificate_of_conductCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Certificate_of_conductCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductUpsertWithoutStudentInput, {
    nullable: true
  })
  upsert?: Certificate_of_conductUpsertWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductWhereUniqueInput, {
    nullable: true
  })
  connect?: Certificate_of_conductWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductUpdateWithoutStudentInput, {
    nullable: true
  })
  update?: Certificate_of_conductUpdateWithoutStudentInput | undefined;
}
