import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningOrderByRelationAggregateInput } from "../inputs/Instructor_screeningOrderByRelationAggregateInput";
import { Project_coaching_screeningOrderByRelationAggregateInput } from "../inputs/Project_coaching_screeningOrderByRelationAggregateInput";
import { ScreeningOrderByRelationAggregateInput } from "../inputs/ScreeningOrderByRelationAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("ScreenerOrderByWithRelationInput", {
  isAbstract: true
})
export class ScreenerOrderByWithRelationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

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
  firstname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  active?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  email?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verification?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verifiedAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authToken?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authTokenUsed?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authTokenSent?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  password?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verified?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  oldNumberID?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningOrderByRelationAggregateInput, {
    nullable: true
  })
  instructor_screening?: Instructor_screeningOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningOrderByRelationAggregateInput, {
    nullable: true
  })
  project_coaching_screening?: Project_coaching_screeningOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningOrderByRelationAggregateInput, {
    nullable: true
  })
  screenings?: ScreeningOrderByRelationAggregateInput | undefined;
}
