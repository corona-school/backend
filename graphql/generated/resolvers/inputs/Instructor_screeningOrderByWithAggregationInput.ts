import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningAvgOrderByAggregateInput } from "../inputs/Instructor_screeningAvgOrderByAggregateInput";
import { Instructor_screeningCountOrderByAggregateInput } from "../inputs/Instructor_screeningCountOrderByAggregateInput";
import { Instructor_screeningMaxOrderByAggregateInput } from "../inputs/Instructor_screeningMaxOrderByAggregateInput";
import { Instructor_screeningMinOrderByAggregateInput } from "../inputs/Instructor_screeningMinOrderByAggregateInput";
import { Instructor_screeningSumOrderByAggregateInput } from "../inputs/Instructor_screeningSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Instructor_screeningOrderByWithAggregationInput", {
  isAbstract: true
})
export class Instructor_screeningOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  success?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  comment?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  knowsCoronaSchoolFrom?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  createdAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  updatedAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  screenerId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Instructor_screeningCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Instructor_screeningAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Instructor_screeningMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Instructor_screeningMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Instructor_screeningSumOrderByAggregateInput | undefined;
}
