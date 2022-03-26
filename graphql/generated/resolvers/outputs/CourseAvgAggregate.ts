import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType("CourseAvgAggregate", {
  isAbstract: true
})
export class CourseAvgAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  publicRanking!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  correspondentId!: number | null;
}
