import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutMatchInput } from "../inputs/PupilCreateWithoutMatchInput";
import { PupilUpdateWithoutMatchInput } from "../inputs/PupilUpdateWithoutMatchInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpsertWithoutMatchInput {
  @TypeGraphQL.Field(_type => PupilUpdateWithoutMatchInput, {
    nullable: false
  })
  update!: PupilUpdateWithoutMatchInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutMatchInput, {
    nullable: false
  })
  create!: PupilCreateWithoutMatchInput;
}
