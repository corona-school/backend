import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningCreateOrConnectWithoutStudentInput } from "../inputs/ScreeningCreateOrConnectWithoutStudentInput";
import { ScreeningCreateWithoutStudentInput } from "../inputs/ScreeningCreateWithoutStudentInput";
import { ScreeningUpdateWithoutStudentInput } from "../inputs/ScreeningUpdateWithoutStudentInput";
import { ScreeningUpsertWithoutStudentInput } from "../inputs/ScreeningUpsertWithoutStudentInput";
import { ScreeningWhereUniqueInput } from "../inputs/ScreeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreeningUpdateOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => ScreeningCreateWithoutStudentInput, {
    nullable: true
  })
  create?: ScreeningCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: ScreeningCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningUpsertWithoutStudentInput, {
    nullable: true
  })
  upsert?: ScreeningUpsertWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningWhereUniqueInput, {
    nullable: true
  })
  connect?: ScreeningWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => ScreeningUpdateWithoutStudentInput, {
    nullable: true
  })
  update?: ScreeningUpdateWithoutStudentInput | undefined;
}
