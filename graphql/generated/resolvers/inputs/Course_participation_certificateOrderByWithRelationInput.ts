import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilOrderByWithRelationInput } from "../inputs/PupilOrderByWithRelationInput";
import { StudentOrderByWithRelationInput } from "../inputs/StudentOrderByWithRelationInput";
import { SubcourseOrderByWithRelationInput } from "../inputs/SubcourseOrderByWithRelationInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_participation_certificateOrderByWithRelationInput", {
  isAbstract: true
})
export class Course_participation_certificateOrderByWithRelationInput {
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
  issuerId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subcourseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => StudentOrderByWithRelationInput, {
    nullable: true
  })
  student?: StudentOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => PupilOrderByWithRelationInput, {
    nullable: true
  })
  pupil?: PupilOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseOrderByWithRelationInput, {
    nullable: true
  })
  subcourse?: SubcourseOrderByWithRelationInput | undefined;
}
