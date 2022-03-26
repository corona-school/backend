import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateCreateManyStudentInput } from "../inputs/Participation_certificateCreateManyStudentInput";

@TypeGraphQL.InputType("Participation_certificateCreateManyStudentInputEnvelope", {
  isAbstract: true
})
export class Participation_certificateCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [Participation_certificateCreateManyStudentInput], {
    nullable: false
  })
  data!: Participation_certificateCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
