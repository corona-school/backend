import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_instructors_studentOrderByInput } from "../../../inputs/Subcourse_instructors_studentOrderByInput";
import { Subcourse_instructors_studentScalarWhereWithAggregatesInput } from "../../../inputs/Subcourse_instructors_studentScalarWhereWithAggregatesInput";
import { Subcourse_instructors_studentWhereInput } from "../../../inputs/Subcourse_instructors_studentWhereInput";
import { Subcourse_instructors_studentScalarFieldEnum } from "../../../../enums/Subcourse_instructors_studentScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupBySubcourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereInput, {
    nullable: true
  })
  where?: Subcourse_instructors_studentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentOrderByInput], {
    nullable: true
  })
  orderBy?: Subcourse_instructors_studentOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"subcourseId" | "studentId">;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Subcourse_instructors_studentScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
