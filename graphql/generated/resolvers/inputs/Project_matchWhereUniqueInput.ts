import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { project_matchUQ_PJ_MATCHCompoundUniqueInput } from "../inputs/project_matchUQ_PJ_MATCHCompoundUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_matchWhereUniqueInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  uuid?: string | undefined;

  @TypeGraphQL.Field(_type => project_matchUQ_PJ_MATCHCompoundUniqueInput, {
    nullable: true
  })
  UQ_PJ_MATCH?: project_matchUQ_PJ_MATCHCompoundUniqueInput | undefined;
}
