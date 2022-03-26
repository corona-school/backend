import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SchoolWhereInput } from "../inputs/SchoolWhereInput";

@TypeGraphQL.InputType("SchoolRelationFilter", {
  isAbstract: true
})
export class SchoolRelationFilter {
  @TypeGraphQL.Field(_type => SchoolWhereInput, {
    nullable: true
  })
  is?: SchoolWhereInput | undefined;

  @TypeGraphQL.Field(_type => SchoolWhereInput, {
    nullable: true
  })
  isNot?: SchoolWhereInput | undefined;
}
