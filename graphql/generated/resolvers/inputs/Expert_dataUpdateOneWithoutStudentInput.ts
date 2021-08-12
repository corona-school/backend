import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataCreateOrConnectWithoutStudentInput } from "../inputs/Expert_dataCreateOrConnectWithoutStudentInput";
import { Expert_dataCreateWithoutStudentInput } from "../inputs/Expert_dataCreateWithoutStudentInput";
import { Expert_dataUpdateWithoutStudentInput } from "../inputs/Expert_dataUpdateWithoutStudentInput";
import { Expert_dataUpsertWithoutStudentInput } from "../inputs/Expert_dataUpsertWithoutStudentInput";
import { Expert_dataWhereUniqueInput } from "../inputs/Expert_dataWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_dataUpdateOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Expert_dataCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Expert_dataCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Expert_dataCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataUpsertWithoutStudentInput, {
    nullable: true
  })
  upsert?: Expert_dataUpsertWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataWhereUniqueInput, {
    nullable: true
  })
  connect?: Expert_dataWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => Expert_dataUpdateWithoutStudentInput, {
    nullable: true
  })
  update?: Expert_dataUpdateWithoutStudentInput | undefined;
}
