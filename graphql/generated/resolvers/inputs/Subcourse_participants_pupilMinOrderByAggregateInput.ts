import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Subcourse_participants_pupilMinOrderByAggregateInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilMinOrderByAggregateInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subcourseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;
}
