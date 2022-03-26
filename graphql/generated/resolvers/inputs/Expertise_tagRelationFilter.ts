import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expertise_tagWhereInput } from "../inputs/Expertise_tagWhereInput";

@TypeGraphQL.InputType("Expertise_tagRelationFilter", {
  isAbstract: true
})
export class Expertise_tagRelationFilter {
  @TypeGraphQL.Field(_type => Expertise_tagWhereInput, {
    nullable: true
  })
  is?: Expertise_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagWhereInput, {
    nullable: true
  })
  isNot?: Expertise_tagWhereInput | undefined;
}
