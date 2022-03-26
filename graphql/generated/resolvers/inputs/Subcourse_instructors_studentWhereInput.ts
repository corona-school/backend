import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntFilter } from "../inputs/IntFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";
import { SubcourseRelationFilter } from "../inputs/SubcourseRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentWhereInput {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentWhereInput], {
    nullable: true
  })
  AND?: Subcourse_instructors_studentWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentWhereInput], {
    nullable: true
  })
  OR?: Subcourse_instructors_studentWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentWhereInput], {
    nullable: true
  })
  NOT?: Subcourse_instructors_studentWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  subcourseId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  studentId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;

  @TypeGraphQL.Field(_type => SubcourseRelationFilter, {
    nullable: true
  })
  subcourse?: SubcourseRelationFilter | undefined;
}
