import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerWhereInput } from "../inputs/ScreenerWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerRelationFilter {
  @TypeGraphQL.Field(_type => ScreenerWhereInput, {
    nullable: true
  })
  is?: ScreenerWhereInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerWhereInput, {
    nullable: true
  })
  isNot?: ScreenerWhereInput | undefined;
}
