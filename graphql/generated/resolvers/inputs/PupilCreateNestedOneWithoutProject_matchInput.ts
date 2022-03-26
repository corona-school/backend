import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutProject_matchInput } from "../inputs/PupilCreateOrConnectWithoutProject_matchInput";
import { PupilCreateWithoutProject_matchInput } from "../inputs/PupilCreateWithoutProject_matchInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateNestedOneWithoutProject_matchInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutProject_matchInput, {
    nullable: true
  })
  create?: PupilCreateWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutProject_matchInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;
}
