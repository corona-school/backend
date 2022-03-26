import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumcourse_coursestate_enumFilter } from "../inputs/NestedEnumcourse_coursestate_enumFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { course_coursestate_enum } from "../../enums/course_coursestate_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnumcourse_coursestate_enumWithAggregatesFilter {
  @TypeGraphQL.Field(_type => course_coursestate_enum, {
    nullable: true
  })
  equals?: "created" | "submitted" | "allowed" | "denied" | "cancelled" | undefined;

  @TypeGraphQL.Field(_type => [course_coursestate_enum], {
    nullable: true
  })
  in?: Array<"created" | "submitted" | "allowed" | "denied" | "cancelled"> | undefined;

  @TypeGraphQL.Field(_type => [course_coursestate_enum], {
    nullable: true
  })
  notIn?: Array<"created" | "submitted" | "allowed" | "denied" | "cancelled"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumcourse_coursestate_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumcourse_coursestate_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumcourse_coursestate_enumFilter, {
    nullable: true
  })
  _min?: NestedEnumcourse_coursestate_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumcourse_coursestate_enumFilter, {
    nullable: true
  })
  _max?: NestedEnumcourse_coursestate_enumFilter | undefined;
}
