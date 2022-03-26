import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";

@TypeGraphQL.ObjectType("Bbb_meeting", {
  isAbstract: true
})
export class Bbb_meeting {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  meetingID!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  meetingName?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  attendeePW?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  moderatorPW?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  alternativeUrl?: string | null;
}
