import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("Concrete_notificationCreateManyInput", {
  isAbstract: true
})
export class Concrete_notificationCreateManyInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  userId!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  notificationID!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  contextID?: string | undefined;

  @TypeGraphQL.Field(_type => GraphQLScalars.JSONResolver, {
    nullable: false
  })
  context!: Prisma.InputJsonValue;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  sentAt!: Date;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  state!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  error?: string | undefined;
}
