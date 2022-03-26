import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseWhereInput } from "../inputs/CourseWhereInput";

@TypeGraphQL.InputType("CourseRelationFilter", {
  isAbstract: true
})
export class CourseRelationFilter {
  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  is?: CourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  isNot?: CourseWhereInput | undefined;
}
