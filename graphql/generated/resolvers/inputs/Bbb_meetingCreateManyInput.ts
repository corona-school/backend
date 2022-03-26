import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Bbb_meetingCreateManyInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  meetingID!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  meetingName?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  attendeePW?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  moderatorPW?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  alternativeUrl?: string | undefined;
}
