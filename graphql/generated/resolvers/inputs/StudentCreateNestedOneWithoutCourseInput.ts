import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutCourseInput } from "../inputs/StudentCreateOrConnectWithoutCourseInput";
import { StudentCreateWithoutCourseInput } from "../inputs/StudentCreateWithoutCourseInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateNestedOneWithoutCourseInput", {
  isAbstract: true
})
export class StudentCreateNestedOneWithoutCourseInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutCourseInput, {
    nullable: true
  })
  create?: StudentCreateWithoutCourseInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutCourseInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutCourseInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
