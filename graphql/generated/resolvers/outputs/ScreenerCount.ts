import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType("ScreenerCount", {
  isAbstract: true
})
export class ScreenerCount {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  instructor_screening!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  project_coaching_screening!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  screenings!: number;
}
