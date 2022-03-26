import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_instructors_studentOrderByWithAggregationInput } from "../../../inputs/Course_instructors_studentOrderByWithAggregationInput";
import { Course_instructors_studentScalarWhereWithAggregatesInput } from "../../../inputs/Course_instructors_studentScalarWhereWithAggregatesInput";
import { Course_instructors_studentWhereInput } from "../../../inputs/Course_instructors_studentWhereInput";
import { Course_instructors_studentScalarFieldEnum } from "../../../../enums/Course_instructors_studentScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByCourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Course_instructors_studentWhereInput, {
    nullable: true
  })
  where?: Course_instructors_studentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Course_instructors_studentOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"courseId" | "studentId">;

  @TypeGraphQL.Field(_type => Course_instructors_studentScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Course_instructors_studentScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
