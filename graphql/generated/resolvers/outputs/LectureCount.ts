import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType("LectureCount", {
  isAbstract: true
})
export class LectureCount {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  course_attendance_log!: number;
}
