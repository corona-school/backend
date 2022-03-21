import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductWhereInput } from "../inputs/Certificate_of_conductWhereInput";

@TypeGraphQL.InputType("Certificate_of_conductRelationFilter", {
  isAbstract: true
})
export class Certificate_of_conductRelationFilter {
  @TypeGraphQL.Field(_type => Certificate_of_conductWhereInput, {
    nullable: true
  })
  is?: Certificate_of_conductWhereInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductWhereInput, {
    nullable: true
  })
  isNot?: Certificate_of_conductWhereInput | undefined;
}
