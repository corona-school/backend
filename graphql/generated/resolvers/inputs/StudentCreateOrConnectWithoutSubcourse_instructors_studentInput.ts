import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutSubcourse_instructors_studentInput } from "../inputs/StudentCreateWithoutSubcourse_instructors_studentInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutSubcourse_instructors_studentInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutSubcourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutSubcourse_instructors_studentInput, {
    nullable: false
  })
  create!: StudentCreateWithoutSubcourse_instructors_studentInput;
}
