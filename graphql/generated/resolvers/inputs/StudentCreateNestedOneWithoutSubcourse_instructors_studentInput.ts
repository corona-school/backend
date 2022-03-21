import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutSubcourse_instructors_studentInput } from "../inputs/StudentCreateOrConnectWithoutSubcourse_instructors_studentInput";
import { StudentCreateWithoutSubcourse_instructors_studentInput } from "../inputs/StudentCreateWithoutSubcourse_instructors_studentInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateNestedOneWithoutSubcourse_instructors_studentInput", {
  isAbstract: true
})
export class StudentCreateNestedOneWithoutSubcourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  create?: StudentCreateWithoutSubcourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutSubcourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
