import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutProject_matchInput } from "../inputs/StudentCreateOrConnectWithoutProject_matchInput";
import { StudentCreateWithoutProject_matchInput } from "../inputs/StudentCreateWithoutProject_matchInput";
import { StudentUpdateWithoutProject_matchInput } from "../inputs/StudentUpdateWithoutProject_matchInput";
import { StudentUpsertWithoutProject_matchInput } from "../inputs/StudentUpsertWithoutProject_matchInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentUpdateOneWithoutProject_matchInput", {
  isAbstract: true
})
export class StudentUpdateOneWithoutProject_matchInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_matchInput, {
    nullable: true
  })
  create?: StudentCreateWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutProject_matchInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutProject_matchInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutProject_matchInput | undefined;

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

  @TypeGraphQL.Field(_type => StudentUpdateWithoutProject_matchInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutProject_matchInput | undefined;
}
