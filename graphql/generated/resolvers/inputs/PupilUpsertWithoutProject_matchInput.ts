import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutProject_matchInput } from "../inputs/PupilCreateWithoutProject_matchInput";
import { PupilUpdateWithoutProject_matchInput } from "../inputs/PupilUpdateWithoutProject_matchInput";

@TypeGraphQL.InputType("PupilUpsertWithoutProject_matchInput", {
  isAbstract: true
})
export class PupilUpsertWithoutProject_matchInput {
  @TypeGraphQL.Field(_type => PupilUpdateWithoutProject_matchInput, {
    nullable: false
  })
  update!: PupilUpdateWithoutProject_matchInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutProject_matchInput, {
    nullable: false
  })
  create!: PupilCreateWithoutProject_matchInput;
}
