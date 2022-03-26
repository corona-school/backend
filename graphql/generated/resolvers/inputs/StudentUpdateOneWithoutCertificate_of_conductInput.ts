import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutCertificate_of_conductInput } from "../inputs/StudentCreateOrConnectWithoutCertificate_of_conductInput";
import { StudentCreateWithoutCertificate_of_conductInput } from "../inputs/StudentCreateWithoutCertificate_of_conductInput";
import { StudentUpdateWithoutCertificate_of_conductInput } from "../inputs/StudentUpdateWithoutCertificate_of_conductInput";
import { StudentUpsertWithoutCertificate_of_conductInput } from "../inputs/StudentUpsertWithoutCertificate_of_conductInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentUpdateOneWithoutCertificate_of_conductInput", {
  isAbstract: true
})
export class StudentUpdateOneWithoutCertificate_of_conductInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutCertificate_of_conductInput, {
    nullable: true
  })
  create?: StudentCreateWithoutCertificate_of_conductInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutCertificate_of_conductInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutCertificate_of_conductInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutCertificate_of_conductInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutCertificate_of_conductInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateWithoutCertificate_of_conductInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutCertificate_of_conductInput | undefined;
}
