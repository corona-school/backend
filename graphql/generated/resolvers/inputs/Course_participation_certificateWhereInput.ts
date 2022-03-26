import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { PupilRelationFilter } from "../inputs/PupilRelationFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";
import { SubcourseRelationFilter } from "../inputs/SubcourseRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_participation_certificateWhereInput {
  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereInput], {
    nullable: true
  })
  AND?: Course_participation_certificateWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereInput], {
    nullable: true
  })
  OR?: Course_participation_certificateWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereInput], {
    nullable: true
  })
  NOT?: Course_participation_certificateWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;

  @TypeGraphQL.Field(_type => PupilRelationFilter, {
    nullable: true
  })
  pupil?: PupilRelationFilter | undefined;

  @TypeGraphQL.Field(_type => SubcourseRelationFilter, {
    nullable: true
  })
  subcourse?: SubcourseRelationFilter | undefined;
}
