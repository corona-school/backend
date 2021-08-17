import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_participation_certificateScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Course_participation_certificateScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Course_participation_certificateScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Course_participation_certificateScalarWhereWithAggregatesInput[] | undefined;

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
  issuerId?: IntNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  pupilId?: IntNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  subcourseId?: IntNullableWithAggregatesFilter | undefined;
}
