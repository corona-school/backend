import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Remission_requestCreateOrConnectWithoutStudentInput } from "../inputs/Remission_requestCreateOrConnectWithoutStudentInput";
import { Remission_requestCreateWithoutStudentInput } from "../inputs/Remission_requestCreateWithoutStudentInput";
import { Remission_requestUpdateWithoutStudentInput } from "../inputs/Remission_requestUpdateWithoutStudentInput";
import { Remission_requestUpsertWithoutStudentInput } from "../inputs/Remission_requestUpsertWithoutStudentInput";
import { Remission_requestWhereUniqueInput } from "../inputs/Remission_requestWhereUniqueInput";

@TypeGraphQL.InputType("Remission_requestUpdateOneWithoutStudentInput", {
  isAbstract: true
})
export class Remission_requestUpdateOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Remission_requestCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Remission_requestCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Remission_requestCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestUpsertWithoutStudentInput, {
    nullable: true
  })
  upsert?: Remission_requestUpsertWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => Remission_requestWhereUniqueInput, {
    nullable: true
  })
  connect?: Remission_requestWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestUpdateWithoutStudentInput, {
    nullable: true
  })
  update?: Remission_requestUpdateWithoutStudentInput | undefined;
}
