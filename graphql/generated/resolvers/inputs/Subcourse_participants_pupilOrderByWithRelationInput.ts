import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilOrderByWithRelationInput } from "../inputs/PupilOrderByWithRelationInput";
import { SubcourseOrderByWithRelationInput } from "../inputs/SubcourseOrderByWithRelationInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Subcourse_participants_pupilOrderByWithRelationInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilOrderByWithRelationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subcourseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => PupilOrderByWithRelationInput, {
    nullable: true
  })
  pupil?: PupilOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseOrderByWithRelationInput, {
    nullable: true
  })
  subcourse?: SubcourseOrderByWithRelationInput | undefined;
}
