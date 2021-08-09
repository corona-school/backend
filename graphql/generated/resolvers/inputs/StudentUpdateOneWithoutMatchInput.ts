import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutMatchInput } from "../inputs/StudentCreateOrConnectWithoutMatchInput";
import { StudentCreateWithoutMatchInput } from "../inputs/StudentCreateWithoutMatchInput";
import { StudentUpdateWithoutMatchInput } from "../inputs/StudentUpdateWithoutMatchInput";
import { StudentUpsertWithoutMatchInput } from "../inputs/StudentUpsertWithoutMatchInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpdateOneWithoutMatchInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutMatchInput, {
    nullable: true
  })
  create?: StudentCreateWithoutMatchInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutMatchInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutMatchInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutMatchInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutMatchInput | undefined;

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

  @TypeGraphQL.Field(_type => StudentUpdateWithoutMatchInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutMatchInput | undefined;
}
