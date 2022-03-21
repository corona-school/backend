import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseOrderByWithRelationInput } from "../inputs/CourseOrderByWithRelationInput";
import { StudentOrderByWithRelationInput } from "../inputs/StudentOrderByWithRelationInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_instructors_studentOrderByWithRelationInput", {
  isAbstract: true
})
export class Course_instructors_studentOrderByWithRelationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => CourseOrderByWithRelationInput, {
    nullable: true
  })
  course?: CourseOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => StudentOrderByWithRelationInput, {
    nullable: true
  })
  student?: StudentOrderByWithRelationInput | undefined;
}
