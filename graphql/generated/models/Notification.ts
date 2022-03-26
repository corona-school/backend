import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";

@TypeGraphQL.ObjectType("Notification", {
  isAbstract: true
})
export class Notification {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  mailjetTemplateId?: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  description!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  active!: boolean;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  recipient!: number;

  @TypeGraphQL.Field(_type => [String], {
    nullable: false
  })
  onActions!: string[];

  @TypeGraphQL.Field(_type => [String], {
    nullable: false
  })
  category!: string[];

  @TypeGraphQL.Field(_type => [String], {
    nullable: false
  })
  cancelledOnAction!: string[];

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  delay?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  interval?: number | null;
}
