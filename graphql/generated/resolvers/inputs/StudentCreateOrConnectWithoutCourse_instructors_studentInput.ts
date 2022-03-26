import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCourse_instructors_studentInput } from "../inputs/StudentCreateWithoutCourse_instructors_studentInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateOrConnectWithoutCourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCourse_instructors_studentInput;
}
