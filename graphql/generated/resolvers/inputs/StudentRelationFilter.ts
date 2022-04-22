import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentWhereInput } from "../inputs/StudentWhereInput";

@TypeGraphQL.InputType("StudentRelationFilter", {
  isAbstract: true
})
export class StudentRelationFilter {
  @TypeGraphQL.Field(_type => StudentWhereInput, {
    nullable: true
  })
  is?: StudentWhereInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereInput, {
    nullable: true
  })
  isNot?: StudentWhereInput | undefined;
}
