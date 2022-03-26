import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tagAvgAggregate } from "../outputs/Course_tagAvgAggregate";
import { Course_tagCountAggregate } from "../outputs/Course_tagCountAggregate";
import { Course_tagMaxAggregate } from "../outputs/Course_tagMaxAggregate";
import { Course_tagMinAggregate } from "../outputs/Course_tagMinAggregate";
import { Course_tagSumAggregate } from "../outputs/Course_tagSumAggregate";

@TypeGraphQL.ObjectType("Course_tagGroupBy", {
  isAbstract: true
})
export class Course_tagGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  identifier!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  category!: string;

  @TypeGraphQL.Field(_type => Course_tagCountAggregate, {
    nullable: true
  })
  _count!: Course_tagCountAggregate | null;

  @TypeGraphQL.Field(_type => Course_tagAvgAggregate, {
    nullable: true
  })
  _avg!: Course_tagAvgAggregate | null;

  @TypeGraphQL.Field(_type => Course_tagSumAggregate, {
    nullable: true
  })
  _sum!: Course_tagSumAggregate | null;

  @TypeGraphQL.Field(_type => Course_tagMinAggregate, {
    nullable: true
  })
  _min!: Course_tagMinAggregate | null;

  @TypeGraphQL.Field(_type => Course_tagMaxAggregate, {
    nullable: true
  })
  _max!: Course_tagMaxAggregate | null;
}
