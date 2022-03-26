import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestCreateManyStudentInput } from "../inputs/Course_guestCreateManyStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_guestCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_guestCreateManyStudentInput], {
    nullable: false
  })
  data!: Course_guestCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
