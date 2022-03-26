import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutScreeningInput } from "../inputs/StudentCreateOrConnectWithoutScreeningInput";
import { StudentCreateWithoutScreeningInput } from "../inputs/StudentCreateWithoutScreeningInput";
import { StudentUpdateWithoutScreeningInput } from "../inputs/StudentUpdateWithoutScreeningInput";
import { StudentUpsertWithoutScreeningInput } from "../inputs/StudentUpsertWithoutScreeningInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpdateOneWithoutScreeningInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutScreeningInput, {
    nullable: true
  })
  create?: StudentCreateWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutScreeningInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutScreeningInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateWithoutScreeningInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutScreeningInput | undefined;
}
