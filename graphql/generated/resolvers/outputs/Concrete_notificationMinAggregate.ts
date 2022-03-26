import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Concrete_notificationMinAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  userId!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  notificationID!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  contextID!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  sentAt!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  state!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  error!: string | null;
}
