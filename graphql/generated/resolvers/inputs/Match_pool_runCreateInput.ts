import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("Match_pool_runCreateInput", {
  isAbstract: true
})
export class Match_pool_runCreateInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  runAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  matchingPool!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  matchesCreated!: number;

  @TypeGraphQL.Field(_type => GraphQLScalars.JSONResolver, {
    nullable: false
  })
  stats!: Prisma.InputJsonValue;
}
