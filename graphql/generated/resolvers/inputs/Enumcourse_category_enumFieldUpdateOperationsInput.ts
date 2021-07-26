import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { course_category_enum } from "../../enums/course_category_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumcourse_category_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => course_category_enum, {
    nullable: true
  })
  set?: "revision" | "club" | "coaching" | undefined;
}
