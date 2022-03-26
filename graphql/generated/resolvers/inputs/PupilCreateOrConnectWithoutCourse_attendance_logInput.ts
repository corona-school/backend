import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutCourse_attendance_logInput } from "../inputs/PupilCreateWithoutCourse_attendance_logInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateOrConnectWithoutCourse_attendance_logInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutCourse_attendance_logInput, {
    nullable: false
  })
  create!: PupilCreateWithoutCourse_attendance_logInput;
}
