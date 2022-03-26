import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutSchoolInput } from "../inputs/PupilCreateWithoutSchoolInput";
import { PupilUpdateWithoutSchoolInput } from "../inputs/PupilUpdateWithoutSchoolInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilUpsertWithWhereUniqueWithoutSchoolInput", {
  isAbstract: true
})
export class PupilUpsertWithWhereUniqueWithoutSchoolInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilUpdateWithoutSchoolInput, {
    nullable: false
  })
  update!: PupilUpdateWithoutSchoolInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutSchoolInput, {
    nullable: false
  })
  create!: PupilCreateWithoutSchoolInput;
}
