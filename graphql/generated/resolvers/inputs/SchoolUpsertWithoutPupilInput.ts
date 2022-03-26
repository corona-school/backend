import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SchoolCreateWithoutPupilInput } from "../inputs/SchoolCreateWithoutPupilInput";
import { SchoolUpdateWithoutPupilInput } from "../inputs/SchoolUpdateWithoutPupilInput";

@TypeGraphQL.InputType("SchoolUpsertWithoutPupilInput", {
  isAbstract: true
})
export class SchoolUpsertWithoutPupilInput {
  @TypeGraphQL.Field(_type => SchoolUpdateWithoutPupilInput, {
    nullable: false
  })
  update!: SchoolUpdateWithoutPupilInput;

  @TypeGraphQL.Field(_type => SchoolCreateWithoutPupilInput, {
    nullable: false
  })
  create!: SchoolCreateWithoutPupilInput;
}
