import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logWhereInput } from "../inputs/Course_attendance_logWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_attendance_logListRelationFilter {
  @TypeGraphQL.Field(_type => Course_attendance_logWhereInput, {
    nullable: true
  })
  every?: Course_attendance_logWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logWhereInput, {
    nullable: true
  })
  some?: Course_attendance_logWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logWhereInput, {
    nullable: true
  })
  none?: Course_attendance_logWhereInput | undefined;
}
