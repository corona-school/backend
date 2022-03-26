import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Remission_requestWhereInput } from "../inputs/Remission_requestWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Remission_requestRelationFilter {
  @TypeGraphQL.Field(_type => Remission_requestWhereInput, {
    nullable: true
  })
  is?: Remission_requestWhereInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestWhereInput, {
    nullable: true
  })
  isNot?: Remission_requestWhereInput | undefined;
}
