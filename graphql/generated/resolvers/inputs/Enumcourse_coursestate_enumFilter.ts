import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumcourse_coursestate_enumFilter } from "../inputs/NestedEnumcourse_coursestate_enumFilter";
import { course_coursestate_enum } from "../../enums/course_coursestate_enum";

@TypeGraphQL.InputType("Enumcourse_coursestate_enumFilter", {
  isAbstract: true
})
export class Enumcourse_coursestate_enumFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumcourse_coursestate_enumFilter, {
    nullable: true
  })
  not?: NestedEnumcourse_coursestate_enumFilter | undefined;
}
