import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutMatchInput } from "../inputs/PupilCreateOrConnectWithoutMatchInput";
import { PupilCreateWithoutMatchInput } from "../inputs/PupilCreateWithoutMatchInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilCreateNestedOneWithoutMatchInput", {
  isAbstract: true
})
export class PupilCreateNestedOneWithoutMatchInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutMatchInput, {
    nullable: true
  })
  create?: PupilCreateWithoutMatchInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutMatchInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutMatchInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;
}
