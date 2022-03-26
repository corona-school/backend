import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { course_category_enum } from "../../enums/course_category_enum";

@TypeGraphQL.InputType("NestedEnumcourse_category_enumFilter", {
  isAbstract: true
})
export class NestedEnumcourse_category_enumFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumcourse_category_enumFilter, {
    nullable: true
  })
  not?: NestedEnumcourse_category_enumFilter | undefined;
}
