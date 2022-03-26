import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType("Course_attendance_logAvgAggregate", {
  isAbstract: true
})
export class Course_attendance_logAvgAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  attendedTime!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  pupilId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  lectureId!: number | null;
}
