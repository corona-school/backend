import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateManyStudentInput } from "../inputs/LectureCreateManyStudentInput";

@TypeGraphQL.InputType("LectureCreateManyStudentInputEnvelope", {
  isAbstract: true
})
export class LectureCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [LectureCreateManyStudentInput], {
    nullable: false
  })
  data!: LectureCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
