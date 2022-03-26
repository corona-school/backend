import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseRelationFilter } from "../inputs/CourseRelationFilter";
import { IntFilter } from "../inputs/IntFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";

@TypeGraphQL.InputType("Course_instructors_studentWhereInput", {
  isAbstract: true
})
export class Course_instructors_studentWhereInput {
  @TypeGraphQL.Field(_type => [Course_instructors_studentWhereInput], {
    nullable: true
  })
  AND?: Course_instructors_studentWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentWhereInput], {
    nullable: true
  })
  OR?: Course_instructors_studentWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentWhereInput], {
    nullable: true
  })
  NOT?: Course_instructors_studentWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  courseId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  studentId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => CourseRelationFilter, {
    nullable: true
  })
  course?: CourseRelationFilter | undefined;

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;
}
