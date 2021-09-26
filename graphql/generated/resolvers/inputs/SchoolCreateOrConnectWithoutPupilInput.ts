import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SchoolCreateWithoutPupilInput } from "../inputs/SchoolCreateWithoutPupilInput";
import { SchoolWhereUniqueInput } from "../inputs/SchoolWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SchoolCreateOrConnectWithoutPupilInput {
  @TypeGraphQL.Field(_type => SchoolWhereUniqueInput, {
    nullable: false
  })
  where!: SchoolWhereUniqueInput;

  @TypeGraphQL.Field(_type => SchoolCreateWithoutPupilInput, {
    nullable: false
  })
  create!: SchoolCreateWithoutPupilInput;
}
