import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningCreateManyScreenerInput } from "../inputs/ScreeningCreateManyScreenerInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreeningCreateManyScreenerInputEnvelope {
  @TypeGraphQL.Field(_type => [ScreeningCreateManyScreenerInput], {
    nullable: false
  })
  data!: ScreeningCreateManyScreenerInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
