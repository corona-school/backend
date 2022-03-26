import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateUpdateWithoutStudentInput } from "../inputs/Course_participation_certificateUpdateWithoutStudentInput";
import { Course_participation_certificateWhereUniqueInput } from "../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Course_participation_certificateUpdateWithWhereUniqueWithoutStudentInput", {
  isAbstract: true
})
export class Course_participation_certificateUpdateWithWhereUniqueWithoutStudentInput {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Course_participation_certificateWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_participation_certificateUpdateWithoutStudentInput, {
    nullable: false
  })
  data!: Course_participation_certificateUpdateWithoutStudentInput;
}
