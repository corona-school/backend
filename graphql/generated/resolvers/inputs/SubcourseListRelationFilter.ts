import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseWhereInput } from "../inputs/SubcourseWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseListRelationFilter {
  @TypeGraphQL.Field(_type => SubcourseWhereInput, {
    nullable: true
  })
  every?: SubcourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereInput, {
    nullable: true
  })
  some?: SubcourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereInput, {
    nullable: true
  })
  none?: SubcourseWhereInput | undefined;
}
