import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { matchUQ_MATCHCompoundUniqueInput } from "../inputs/matchUQ_MATCHCompoundUniqueInput";

@TypeGraphQL.InputType("MatchWhereUniqueInput", {
  isAbstract: true
})
export class MatchWhereUniqueInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  uuid?: string | undefined;

  @TypeGraphQL.Field(_type => matchUQ_MATCHCompoundUniqueInput, {
    nullable: true
  })
  UQ_MATCH?: matchUQ_MATCHCompoundUniqueInput | undefined;
}
