import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentCreateManyStudentInput } from "../inputs/Course_instructors_studentCreateManyStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_instructors_studentCreateManyStudentInput], {
    nullable: false
  })
  data!: Course_instructors_studentCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
