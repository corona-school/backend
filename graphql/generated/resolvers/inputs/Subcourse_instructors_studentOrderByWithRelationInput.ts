import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentOrderByWithRelationInput } from "../inputs/StudentOrderByWithRelationInput";
import { SubcourseOrderByWithRelationInput } from "../inputs/SubcourseOrderByWithRelationInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Subcourse_instructors_studentOrderByWithRelationInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentOrderByWithRelationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subcourseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => StudentOrderByWithRelationInput, {
    nullable: true
  })
  student?: StudentOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseOrderByWithRelationInput, {
    nullable: true
  })
  subcourse?: SubcourseOrderByWithRelationInput | undefined;
}
