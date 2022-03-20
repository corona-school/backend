import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutLectureInput } from "../inputs/StudentCreateWithoutLectureInput";
import { StudentUpdateWithoutLectureInput } from "../inputs/StudentUpdateWithoutLectureInput";

@TypeGraphQL.InputType("StudentUpsertWithoutLectureInput", {
  isAbstract: true
})
export class StudentUpsertWithoutLectureInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutLectureInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutLectureInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutLectureInput, {
    nullable: false
  })
  create!: StudentCreateWithoutLectureInput;
}
