import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutProject_matchInput } from "../inputs/PupilCreateWithoutProject_matchInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilCreateOrConnectWithoutProject_matchInput", {
  isAbstract: true
})
export class PupilCreateOrConnectWithoutProject_matchInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutProject_matchInput, {
    nullable: false
  })
  create!: PupilCreateWithoutProject_matchInput;
}
