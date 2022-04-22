import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilUpdateWithoutSchoolInput } from "../inputs/PupilUpdateWithoutSchoolInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilUpdateWithWhereUniqueWithoutSchoolInput", {
  isAbstract: true
})
export class PupilUpdateWithWhereUniqueWithoutSchoolInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilUpdateWithoutSchoolInput, {
    nullable: false
  })
  data!: PupilUpdateWithoutSchoolInput;
}
