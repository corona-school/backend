import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutCourse_guestInput } from "../inputs/StudentCreateOrConnectWithoutCourse_guestInput";
import { StudentCreateWithoutCourse_guestInput } from "../inputs/StudentCreateWithoutCourse_guestInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateNestedOneWithoutCourse_guestInput", {
  isAbstract: true
})
export class StudentCreateNestedOneWithoutCourse_guestInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_guestInput, {
    nullable: true
  })
  create?: StudentCreateWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutCourse_guestInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
