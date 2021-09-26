import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestAvgAggregate } from "../outputs/Course_guestAvgAggregate";
import { Course_guestCountAggregate } from "../outputs/Course_guestCountAggregate";
import { Course_guestMaxAggregate } from "../outputs/Course_guestMaxAggregate";
import { Course_guestMinAggregate } from "../outputs/Course_guestMinAggregate";
import { Course_guestSumAggregate } from "../outputs/Course_guestSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Course_guestGroupBy {
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
  token!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  firstname!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  lastname!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  email!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  courseId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  inviterId!: number | null;

  @TypeGraphQL.Field(_type => Course_guestCountAggregate, {
    nullable: true
  })
  _count!: Course_guestCountAggregate | null;

  @TypeGraphQL.Field(_type => Course_guestAvgAggregate, {
    nullable: true
  })
  _avg!: Course_guestAvgAggregate | null;

  @TypeGraphQL.Field(_type => Course_guestSumAggregate, {
    nullable: true
  })
  _sum!: Course_guestSumAggregate | null;

  @TypeGraphQL.Field(_type => Course_guestMinAggregate, {
    nullable: true
  })
  _min!: Course_guestMinAggregate | null;

  @TypeGraphQL.Field(_type => Course_guestMaxAggregate, {
    nullable: true
  })
  _max!: Course_guestMaxAggregate | null;
}
