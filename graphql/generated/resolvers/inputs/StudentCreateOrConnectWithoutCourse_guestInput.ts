import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCourse_guestInput } from "../inputs/StudentCreateWithoutCourse_guestInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutCourse_guestInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutCourse_guestInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_guestInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCourse_guestInput;
}
