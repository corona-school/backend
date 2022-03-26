import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutScreeningInput } from "../inputs/StudentCreateOrConnectWithoutScreeningInput";
import { StudentCreateWithoutScreeningInput } from "../inputs/StudentCreateWithoutScreeningInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateNestedOneWithoutScreeningInput", {
  isAbstract: true
})
export class StudentCreateNestedOneWithoutScreeningInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutScreeningInput, {
    nullable: true
  })
  create?: StudentCreateWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutScreeningInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
