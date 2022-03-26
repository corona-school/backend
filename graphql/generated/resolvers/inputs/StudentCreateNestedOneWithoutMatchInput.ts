import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutMatchInput } from "../inputs/StudentCreateOrConnectWithoutMatchInput";
import { StudentCreateWithoutMatchInput } from "../inputs/StudentCreateWithoutMatchInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateNestedOneWithoutMatchInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutMatchInput, {
    nullable: true
  })
  create?: StudentCreateWithoutMatchInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutMatchInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutMatchInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
