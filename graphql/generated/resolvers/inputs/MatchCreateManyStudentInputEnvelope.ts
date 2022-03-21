import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchCreateManyStudentInput } from "../inputs/MatchCreateManyStudentInput";

@TypeGraphQL.InputType("MatchCreateManyStudentInputEnvelope", {
  isAbstract: true
})
export class MatchCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [MatchCreateManyStudentInput], {
    nullable: false
  })
  data!: MatchCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
