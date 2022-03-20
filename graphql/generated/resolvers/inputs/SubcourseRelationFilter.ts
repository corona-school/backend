import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseWhereInput } from "../inputs/SubcourseWhereInput";

@TypeGraphQL.InputType("SubcourseRelationFilter", {
  isAbstract: true
})
export class SubcourseRelationFilter {
  @TypeGraphQL.Field(_type => SubcourseWhereInput, {
    nullable: true
  })
  is?: SubcourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereInput, {
    nullable: true
  })
  isNot?: SubcourseWhereInput | undefined;
}
