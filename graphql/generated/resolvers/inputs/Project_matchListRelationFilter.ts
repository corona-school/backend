import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchWhereInput } from "../inputs/Project_matchWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_matchListRelationFilter {
  @TypeGraphQL.Field(_type => Project_matchWhereInput, {
    nullable: true
  })
  every?: Project_matchWhereInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchWhereInput, {
    nullable: true
  })
  some?: Project_matchWhereInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchWhereInput, {
    nullable: true
  })
  none?: Project_matchWhereInput | undefined;
}
