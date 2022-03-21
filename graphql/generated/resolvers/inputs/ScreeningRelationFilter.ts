import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningWhereInput } from "../inputs/ScreeningWhereInput";

@TypeGraphQL.InputType("ScreeningRelationFilter", {
  isAbstract: true
})
export class ScreeningRelationFilter {
  @TypeGraphQL.Field(_type => ScreeningWhereInput, {
    nullable: true
  })
  is?: ScreeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningWhereInput, {
    nullable: true
  })
  isNot?: ScreeningWhereInput | undefined;
}
