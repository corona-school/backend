import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutProject_matchInput } from "../inputs/StudentCreateOrConnectWithoutProject_matchInput";
import { StudentCreateWithoutProject_matchInput } from "../inputs/StudentCreateWithoutProject_matchInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateNestedOneWithoutProject_matchInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_matchInput, {
    nullable: true
  })
  create?: StudentCreateWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutProject_matchInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
