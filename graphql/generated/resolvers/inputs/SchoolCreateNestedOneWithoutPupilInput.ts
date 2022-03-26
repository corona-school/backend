import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SchoolCreateOrConnectWithoutPupilInput } from "../inputs/SchoolCreateOrConnectWithoutPupilInput";
import { SchoolCreateWithoutPupilInput } from "../inputs/SchoolCreateWithoutPupilInput";
import { SchoolWhereUniqueInput } from "../inputs/SchoolWhereUniqueInput";

@TypeGraphQL.InputType("SchoolCreateNestedOneWithoutPupilInput", {
  isAbstract: true
})
export class SchoolCreateNestedOneWithoutPupilInput {
  @TypeGraphQL.Field(_type => SchoolCreateWithoutPupilInput, {
    nullable: true
  })
  create?: SchoolCreateWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => SchoolCreateOrConnectWithoutPupilInput, {
    nullable: true
  })
  connectOrCreate?: SchoolCreateOrConnectWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => SchoolWhereUniqueInput, {
    nullable: true
  })
  connect?: SchoolWhereUniqueInput | undefined;
}
