import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutLectureInput } from "../inputs/StudentCreateWithoutLectureInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutLectureInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutLectureInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutLectureInput, {
    nullable: false
  })
  create!: StudentCreateWithoutLectureInput;
}
