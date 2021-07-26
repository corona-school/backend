import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumcourse_category_enumFilter } from "../inputs/NestedEnumcourse_category_enumFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { course_category_enum } from "../../enums/course_category_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnumcourse_category_enumWithAggregatesFilter {
  @TypeGraphQL.Field(_type => course_category_enum, {
    nullable: true
  })
  equals?: "revision" | "club" | "coaching" | undefined;

  @TypeGraphQL.Field(_type => [course_category_enum], {
    nullable: true
  })
  in?: Array<"revision" | "club" | "coaching"> | undefined;

  @TypeGraphQL.Field(_type => [course_category_enum], {
    nullable: true
  })
  notIn?: Array<"revision" | "club" | "coaching"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumcourse_category_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumcourse_category_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumcourse_category_enumFilter, {
    nullable: true
  })
  _min?: NestedEnumcourse_category_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumcourse_category_enumFilter, {
    nullable: true
  })
  _max?: NestedEnumcourse_category_enumFilter | undefined;
}
