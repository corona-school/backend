import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType("Concrete_notificationAvgAggregate", {
  isAbstract: true
})
export class Concrete_notificationAvgAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  notificationID!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  state!: number | null;
}
