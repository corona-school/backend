import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutProject_coaching_screeningInput } from "../inputs/StudentCreateOrConnectWithoutProject_coaching_screeningInput";
import { StudentCreateWithoutProject_coaching_screeningInput } from "../inputs/StudentCreateWithoutProject_coaching_screeningInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateNestedOneWithoutProject_coaching_screeningInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_coaching_screeningInput, {
    nullable: true
  })
  create?: StudentCreateWithoutProject_coaching_screeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutProject_coaching_screeningInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutProject_coaching_screeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
