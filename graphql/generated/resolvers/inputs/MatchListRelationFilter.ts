import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchWhereInput } from "../inputs/MatchWhereInput";

@TypeGraphQL.InputType("MatchListRelationFilter", {
  isAbstract: true
})
export class MatchListRelationFilter {
  @TypeGraphQL.Field(_type => MatchWhereInput, {
    nullable: true
  })
  every?: MatchWhereInput | undefined;

  @TypeGraphQL.Field(_type => MatchWhereInput, {
    nullable: true
  })
  some?: MatchWhereInput | undefined;

  @TypeGraphQL.Field(_type => MatchWhereInput, {
    nullable: true
  })
  none?: MatchWhereInput | undefined;
}
