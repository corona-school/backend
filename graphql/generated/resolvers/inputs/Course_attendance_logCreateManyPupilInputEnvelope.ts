import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logCreateManyPupilInput } from "../inputs/Course_attendance_logCreateManyPupilInput";

@TypeGraphQL.InputType("Course_attendance_logCreateManyPupilInputEnvelope", {
  isAbstract: true
})
export class Course_attendance_logCreateManyPupilInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_attendance_logCreateManyPupilInput], {
    nullable: false
  })
  data!: Course_attendance_logCreateManyPupilInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
