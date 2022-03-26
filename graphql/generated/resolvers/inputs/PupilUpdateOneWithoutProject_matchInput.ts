import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutProject_matchInput } from "../inputs/PupilCreateOrConnectWithoutProject_matchInput";
import { PupilCreateWithoutProject_matchInput } from "../inputs/PupilCreateWithoutProject_matchInput";
import { PupilUpdateWithoutProject_matchInput } from "../inputs/PupilUpdateWithoutProject_matchInput";
import { PupilUpsertWithoutProject_matchInput } from "../inputs/PupilUpsertWithoutProject_matchInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpdateOneWithoutProject_matchInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutProject_matchInput, {
    nullable: true
  })
  create?: PupilCreateWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutProject_matchInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpsertWithoutProject_matchInput, {
    nullable: true
  })
  upsert?: PupilUpsertWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateWithoutProject_matchInput, {
    nullable: true
  })
  update?: PupilUpdateWithoutProject_matchInput | undefined;
}
