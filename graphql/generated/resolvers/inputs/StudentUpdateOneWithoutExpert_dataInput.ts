import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutExpert_dataInput } from "../inputs/StudentCreateOrConnectWithoutExpert_dataInput";
import { StudentCreateWithoutExpert_dataInput } from "../inputs/StudentCreateWithoutExpert_dataInput";
import { StudentUpdateWithoutExpert_dataInput } from "../inputs/StudentUpdateWithoutExpert_dataInput";
import { StudentUpsertWithoutExpert_dataInput } from "../inputs/StudentUpsertWithoutExpert_dataInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentUpdateOneWithoutExpert_dataInput", {
  isAbstract: true
})
export class StudentUpdateOneWithoutExpert_dataInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutExpert_dataInput, {
    nullable: true
  })
  create?: StudentCreateWithoutExpert_dataInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutExpert_dataInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutExpert_dataInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutExpert_dataInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutExpert_dataInput | undefined;

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

  @TypeGraphQL.Field(_type => StudentUpdateWithoutExpert_dataInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutExpert_dataInput | undefined;
}
