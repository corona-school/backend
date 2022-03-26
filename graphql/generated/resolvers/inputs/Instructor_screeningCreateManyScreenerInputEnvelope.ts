import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningCreateManyScreenerInput } from "../inputs/Instructor_screeningCreateManyScreenerInput";

@TypeGraphQL.InputType("Instructor_screeningCreateManyScreenerInputEnvelope", {
  isAbstract: true
})
export class Instructor_screeningCreateManyScreenerInputEnvelope {
  @TypeGraphQL.Field(_type => [Instructor_screeningCreateManyScreenerInput], {
    nullable: false
  })
  data!: Instructor_screeningCreateManyScreenerInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
