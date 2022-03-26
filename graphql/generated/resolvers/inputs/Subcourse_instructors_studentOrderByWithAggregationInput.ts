import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentAvgOrderByAggregateInput } from "../inputs/Subcourse_instructors_studentAvgOrderByAggregateInput";
import { Subcourse_instructors_studentCountOrderByAggregateInput } from "../inputs/Subcourse_instructors_studentCountOrderByAggregateInput";
import { Subcourse_instructors_studentMaxOrderByAggregateInput } from "../inputs/Subcourse_instructors_studentMaxOrderByAggregateInput";
import { Subcourse_instructors_studentMinOrderByAggregateInput } from "../inputs/Subcourse_instructors_studentMinOrderByAggregateInput";
import { Subcourse_instructors_studentSumOrderByAggregateInput } from "../inputs/Subcourse_instructors_studentSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Subcourse_instructors_studentOrderByWithAggregationInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subcourseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Subcourse_instructors_studentCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Subcourse_instructors_studentAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Subcourse_instructors_studentMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Subcourse_instructors_studentMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Subcourse_instructors_studentSumOrderByAggregateInput | undefined;
}
