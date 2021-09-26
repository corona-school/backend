import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Jufo_verification_transmissionWhereInput } from "../inputs/Jufo_verification_transmissionWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Jufo_verification_transmissionRelationFilter {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereInput, {
    nullable: true
  })
  is?: Jufo_verification_transmissionWhereInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereInput, {
    nullable: true
  })
  isNot?: Jufo_verification_transmissionWhereInput | undefined;
}
