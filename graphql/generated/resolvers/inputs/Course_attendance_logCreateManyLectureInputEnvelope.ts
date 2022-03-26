import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logCreateManyLectureInput } from "../inputs/Course_attendance_logCreateManyLectureInput";

@TypeGraphQL.InputType("Course_attendance_logCreateManyLectureInputEnvelope", {
  isAbstract: true
})
export class Course_attendance_logCreateManyLectureInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_attendance_logCreateManyLectureInput], {
    nullable: false
  })
  data!: Course_attendance_logCreateManyLectureInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
