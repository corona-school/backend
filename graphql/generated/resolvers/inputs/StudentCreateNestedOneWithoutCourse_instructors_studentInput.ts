import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutCourse_instructors_studentInput } from "../inputs/StudentCreateOrConnectWithoutCourse_instructors_studentInput";
import { StudentCreateWithoutCourse_instructors_studentInput } from "../inputs/StudentCreateWithoutCourse_instructors_studentInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateNestedOneWithoutCourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_instructors_studentInput, {
    nullable: true
  })
  create?: StudentCreateWithoutCourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutCourse_instructors_studentInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutCourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
