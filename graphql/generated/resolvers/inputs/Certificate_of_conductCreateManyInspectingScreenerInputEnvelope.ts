import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductCreateManyInspectingScreenerInput } from "../inputs/Certificate_of_conductCreateManyInspectingScreenerInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductCreateManyInspectingScreenerInputEnvelope {
  @TypeGraphQL.Field(_type => [Certificate_of_conductCreateManyInspectingScreenerInput], {
    nullable: false
  })
  data!: Certificate_of_conductCreateManyInspectingScreenerInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
