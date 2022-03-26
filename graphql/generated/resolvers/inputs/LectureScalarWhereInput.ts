import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureScalarWhereInput {
  @TypeGraphQL.Field(_type => [LectureScalarWhereInput], {
    nullable: true
  })
  AND?: LectureScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureScalarWhereInput], {
    nullable: true
  })
  OR?: LectureScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureScalarWhereInput], {
    nullable: true
  })
  NOT?: LectureScalarWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  start?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  duration?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  instructorId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  subcourseId?: IntNullableFilter | undefined;
}
