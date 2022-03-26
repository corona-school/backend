import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCourse_participation_certificateInput } from "../inputs/StudentCreateWithoutCourse_participation_certificateInput";
import { StudentUpdateWithoutCourse_participation_certificateInput } from "../inputs/StudentUpdateWithoutCourse_participation_certificateInput";

@TypeGraphQL.InputType("StudentUpsertWithoutCourse_participation_certificateInput", {
  isAbstract: true
})
export class StudentUpsertWithoutCourse_participation_certificateInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutCourse_participation_certificateInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutCourse_participation_certificateInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_participation_certificateInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCourse_participation_certificateInput;
}
