import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseWhereInput } from "../inputs/CourseWhereInput";

@TypeGraphQL.InputType("CourseListRelationFilter", {
  isAbstract: true
})
export class CourseListRelationFilter {
  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  every?: CourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  some?: CourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  none?: CourseWhereInput | undefined;
}
