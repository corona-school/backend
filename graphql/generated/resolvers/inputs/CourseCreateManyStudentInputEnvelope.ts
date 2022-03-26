import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateManyStudentInput } from "../inputs/CourseCreateManyStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [CourseCreateManyStudentInput], {
    nullable: false
  })
  data!: CourseCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
