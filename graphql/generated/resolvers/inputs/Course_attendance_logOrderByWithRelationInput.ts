import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureOrderByWithRelationInput } from "../inputs/LectureOrderByWithRelationInput";
import { PupilOrderByWithRelationInput } from "../inputs/PupilOrderByWithRelationInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_attendance_logOrderByWithRelationInput", {
  isAbstract: true
})
export class Course_attendance_logOrderByWithRelationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  createdAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  updatedAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  attendedTime?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  ip?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lectureId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => LectureOrderByWithRelationInput, {
    nullable: true
  })
  lecture?: LectureOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => PupilOrderByWithRelationInput, {
    nullable: true
  })
  pupil?: PupilOrderByWithRelationInput | undefined;
}
