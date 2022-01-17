import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutRemission_requestInput } from "../inputs/StudentCreateOrConnectWithoutRemission_requestInput";
import { StudentCreateWithoutRemission_requestInput } from "../inputs/StudentCreateWithoutRemission_requestInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateNestedOneWithoutRemission_requestInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutRemission_requestInput, {
    nullable: true
  })
  create?: StudentCreateWithoutRemission_requestInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutRemission_requestInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutRemission_requestInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
