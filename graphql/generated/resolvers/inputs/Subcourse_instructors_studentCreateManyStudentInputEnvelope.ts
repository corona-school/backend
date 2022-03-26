import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentCreateManyStudentInput } from "../inputs/Subcourse_instructors_studentCreateManyStudentInput";

@TypeGraphQL.InputType("Subcourse_instructors_studentCreateManyStudentInputEnvelope", {
  isAbstract: true
})
export class Subcourse_instructors_studentCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateManyStudentInput], {
    nullable: false
  })
  data!: Subcourse_instructors_studentCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
