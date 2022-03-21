import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentAvgOrderByAggregateInput } from "../inputs/Course_instructors_studentAvgOrderByAggregateInput";
import { Course_instructors_studentCountOrderByAggregateInput } from "../inputs/Course_instructors_studentCountOrderByAggregateInput";
import { Course_instructors_studentMaxOrderByAggregateInput } from "../inputs/Course_instructors_studentMaxOrderByAggregateInput";
import { Course_instructors_studentMinOrderByAggregateInput } from "../inputs/Course_instructors_studentMinOrderByAggregateInput";
import { Course_instructors_studentSumOrderByAggregateInput } from "../inputs/Course_instructors_studentSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_instructors_studentOrderByWithAggregationInput", {
  isAbstract: true
})
export class Course_instructors_studentOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Course_instructors_studentCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Course_instructors_studentAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Course_instructors_studentMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Course_instructors_studentMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Course_instructors_studentSumOrderByAggregateInput | undefined;
}
