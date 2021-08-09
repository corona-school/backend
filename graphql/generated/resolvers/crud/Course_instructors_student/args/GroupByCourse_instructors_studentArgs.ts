import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_instructors_studentOrderByInput } from "../../../inputs/Course_instructors_studentOrderByInput";
import { Course_instructors_studentScalarWhereWithAggregatesInput } from "../../../inputs/Course_instructors_studentScalarWhereWithAggregatesInput";
import { Course_instructors_studentWhereInput } from "../../../inputs/Course_instructors_studentWhereInput";
import { Course_instructors_studentScalarFieldEnum } from "../../../../enums/Course_instructors_studentScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByCourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Course_instructors_studentWhereInput, {
    nullable: true
  })
  where?: Course_instructors_studentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentOrderByInput], {
    nullable: true
  })
  orderBy?: Course_instructors_studentOrderByInput[] | undefined;

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
