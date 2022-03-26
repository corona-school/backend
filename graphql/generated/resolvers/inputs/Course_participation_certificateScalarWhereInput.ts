import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";

@TypeGraphQL.InputType("Course_participation_certificateScalarWhereInput", {
  isAbstract: true
})
export class Course_participation_certificateScalarWhereInput {
  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarWhereInput], {
    nullable: true
  })
  AND?: Course_participation_certificateScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarWhereInput], {
    nullable: true
  })
  OR?: Course_participation_certificateScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarWhereInput], {
    nullable: true
  })
  NOT?: Course_participation_certificateScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  issuerId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  pupilId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  subcourseId?: IntNullableFilter | undefined;
}
