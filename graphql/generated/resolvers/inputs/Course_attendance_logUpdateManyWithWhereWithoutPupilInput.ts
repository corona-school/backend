import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logScalarWhereInput } from "../inputs/Course_attendance_logScalarWhereInput";
import { Course_attendance_logUpdateManyMutationInput } from "../inputs/Course_attendance_logUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_attendance_logUpdateManyWithWhereWithoutPupilInput {
  @TypeGraphQL.Field(_type => Course_attendance_logScalarWhereInput, {
    nullable: false
  })
  where!: Course_attendance_logScalarWhereInput;

  @TypeGraphQL.Field(_type => Course_attendance_logUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_attendance_logUpdateManyMutationInput;
}
