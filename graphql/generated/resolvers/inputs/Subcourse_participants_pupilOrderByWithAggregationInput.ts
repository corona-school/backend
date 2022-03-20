import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilAvgOrderByAggregateInput } from "../inputs/Subcourse_participants_pupilAvgOrderByAggregateInput";
import { Subcourse_participants_pupilCountOrderByAggregateInput } from "../inputs/Subcourse_participants_pupilCountOrderByAggregateInput";
import { Subcourse_participants_pupilMaxOrderByAggregateInput } from "../inputs/Subcourse_participants_pupilMaxOrderByAggregateInput";
import { Subcourse_participants_pupilMinOrderByAggregateInput } from "../inputs/Subcourse_participants_pupilMinOrderByAggregateInput";
import { Subcourse_participants_pupilSumOrderByAggregateInput } from "../inputs/Subcourse_participants_pupilSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Subcourse_participants_pupilOrderByWithAggregationInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subcourseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Subcourse_participants_pupilCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Subcourse_participants_pupilAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Subcourse_participants_pupilMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Subcourse_participants_pupilMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Subcourse_participants_pupilSumOrderByAggregateInput | undefined;
}
