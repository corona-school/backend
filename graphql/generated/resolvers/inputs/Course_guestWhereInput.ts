import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseRelationFilter } from "../inputs/CourseRelationFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_guestWhereInput {
  @TypeGraphQL.Field(_type => [Course_guestWhereInput], {
    nullable: true
  })
  AND?: Course_guestWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestWhereInput], {
    nullable: true
  })
  OR?: Course_guestWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestWhereInput], {
    nullable: true
  })
  NOT?: Course_guestWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  token?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  firstname?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  lastname?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  email?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  courseId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  inviterId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => CourseRelationFilter, {
    nullable: true
  })
  course?: CourseRelationFilter | undefined;

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;
}
