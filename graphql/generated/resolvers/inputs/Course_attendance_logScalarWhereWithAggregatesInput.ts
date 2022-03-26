import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringNullableWithAggregatesFilter } from "../inputs/StringNullableWithAggregatesFilter";

@TypeGraphQL.InputType("Course_attendance_logScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Course_attendance_logScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Course_attendance_logScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Course_attendance_logScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Course_attendance_logScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Course_attendance_logScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  createdAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  updatedAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  attendedTime?: IntNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  ip?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  pupilId?: IntNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  lectureId?: IntNullableWithAggregatesFilter | undefined;
}
