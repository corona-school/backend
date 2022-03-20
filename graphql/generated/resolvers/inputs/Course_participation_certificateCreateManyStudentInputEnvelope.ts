import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateManyStudentInput } from "../inputs/Course_participation_certificateCreateManyStudentInput";

@TypeGraphQL.InputType("Course_participation_certificateCreateManyStudentInputEnvelope", {
  isAbstract: true
})
export class Course_participation_certificateCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateManyStudentInput], {
    nullable: false
  })
  data!: Course_participation_certificateCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
