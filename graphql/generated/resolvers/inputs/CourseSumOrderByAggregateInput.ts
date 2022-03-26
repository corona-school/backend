import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("CourseSumOrderByAggregateInput", {
  isAbstract: true
})
export class CourseSumOrderByAggregateInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  publicRanking?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  correspondentId?: "asc" | "desc" | undefined;
}
