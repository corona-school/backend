import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutExpert_dataInput } from "../inputs/StudentCreateOrConnectWithoutExpert_dataInput";
import { StudentCreateWithoutExpert_dataInput } from "../inputs/StudentCreateWithoutExpert_dataInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateNestedOneWithoutExpert_dataInput", {
  isAbstract: true
})
export class StudentCreateNestedOneWithoutExpert_dataInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutExpert_dataInput, {
    nullable: true
  })
  create?: StudentCreateWithoutExpert_dataInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutExpert_dataInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutExpert_dataInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
