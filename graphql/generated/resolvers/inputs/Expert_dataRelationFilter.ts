import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataWhereInput } from "../inputs/Expert_dataWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_dataRelationFilter {
  @TypeGraphQL.Field(_type => Expert_dataWhereInput, {
    nullable: true
  })
  is?: Expert_dataWhereInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataWhereInput, {
    nullable: true
  })
  isNot?: Expert_dataWhereInput | undefined;
}
