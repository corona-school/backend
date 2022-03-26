import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType("Bbb_meetingAvgAggregate", {
  isAbstract: true
})
export class Bbb_meetingAvgAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  id!: number | null;
}
