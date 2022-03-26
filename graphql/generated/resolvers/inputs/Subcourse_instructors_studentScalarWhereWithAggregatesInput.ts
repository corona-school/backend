import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType("Subcourse_instructors_studentScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Subcourse_instructors_studentScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Subcourse_instructors_studentScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Subcourse_instructors_studentScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  subcourseId?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  studentId?: IntWithAggregatesFilter | undefined;
}
