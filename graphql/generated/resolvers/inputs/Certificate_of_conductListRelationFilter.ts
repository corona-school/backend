import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductWhereInput } from "../inputs/Certificate_of_conductWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductListRelationFilter {
  @TypeGraphQL.Field(_type => Certificate_of_conductWhereInput, {
    nullable: true
  })
  every?: Certificate_of_conductWhereInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductWhereInput, {
    nullable: true
  })
  some?: Certificate_of_conductWhereInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductWhereInput, {
    nullable: true
  })
  none?: Certificate_of_conductWhereInput | undefined;
}
