import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCourse_participation_certificateInput } from "../inputs/StudentCreateWithoutCourse_participation_certificateInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutCourse_participation_certificateInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutCourse_participation_certificateInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_participation_certificateInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCourse_participation_certificateInput;
}
