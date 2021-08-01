import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCourse_guestInput } from "../inputs/StudentCreateWithoutCourse_guestInput";
import { StudentUpdateWithoutCourse_guestInput } from "../inputs/StudentUpdateWithoutCourse_guestInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpsertWithoutCourse_guestInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutCourse_guestInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutCourse_guestInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_guestInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCourse_guestInput;
}
