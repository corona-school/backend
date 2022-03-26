import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType("SubcourseCountAggregate", {
  isAbstract: true
})
export class SubcourseCountAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  createdAt!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  updatedAt!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  minGrade!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  maxGrade!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  maxParticipants!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  joinAfterStart!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  published!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  cancelled!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  courseId!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  _all!: number;
}
