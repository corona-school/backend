import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType("Course_instructors_studentScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Course_instructors_studentScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Course_instructors_studentScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Course_instructors_studentScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Course_instructors_studentScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Course_instructors_studentScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  courseId?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  studentId?: IntWithAggregatesFilter | undefined;
}
