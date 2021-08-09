import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logCreateWithoutPupilInput } from "../inputs/Course_attendance_logCreateWithoutPupilInput";
import { Course_attendance_logUpdateWithoutPupilInput } from "../inputs/Course_attendance_logUpdateWithoutPupilInput";
import { Course_attendance_logWhereUniqueInput } from "../inputs/Course_attendance_logWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_attendance_logUpsertWithWhereUniqueWithoutPupilInput {
  @TypeGraphQL.Field(_type => Course_attendance_logWhereUniqueInput, {
    nullable: false
  })
  where!: Course_attendance_logWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_attendance_logUpdateWithoutPupilInput, {
    nullable: false
  })
  update!: Course_attendance_logUpdateWithoutPupilInput;

  @TypeGraphQL.Field(_type => Course_attendance_logCreateWithoutPupilInput, {
    nullable: false
  })
  create!: Course_attendance_logCreateWithoutPupilInput;
}
