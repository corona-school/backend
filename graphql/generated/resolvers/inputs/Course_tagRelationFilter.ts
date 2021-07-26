import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tagWhereInput } from "../inputs/Course_tagWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tagRelationFilter {
  @TypeGraphQL.Field(_type => Course_tagWhereInput, {
    nullable: true
  })
  is?: Course_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_tagWhereInput, {
    nullable: true
  })
  isNot?: Course_tagWhereInput | undefined;
}
