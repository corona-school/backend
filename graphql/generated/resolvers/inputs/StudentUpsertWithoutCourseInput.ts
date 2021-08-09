import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCourseInput } from "../inputs/StudentCreateWithoutCourseInput";
import { StudentUpdateWithoutCourseInput } from "../inputs/StudentUpdateWithoutCourseInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpsertWithoutCourseInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutCourseInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutCourseInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCourseInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCourseInput;
}
