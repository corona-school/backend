import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutMatchInput } from "../inputs/PupilCreateWithoutMatchInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilCreateOrConnectWithoutMatchInput", {
  isAbstract: true
})
export class PupilCreateOrConnectWithoutMatchInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutMatchInput, {
    nullable: false
  })
  create!: PupilCreateWithoutMatchInput;
}
