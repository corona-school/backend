import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningWhereInput } from "../inputs/ScreeningWhereInput";

@TypeGraphQL.InputType("ScreeningListRelationFilter", {
  isAbstract: true
})
export class ScreeningListRelationFilter {
  @TypeGraphQL.Field(_type => ScreeningWhereInput, {
    nullable: true
  })
  every?: ScreeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningWhereInput, {
    nullable: true
  })
  some?: ScreeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningWhereInput, {
    nullable: true
  })
  none?: ScreeningWhereInput | undefined;
}
