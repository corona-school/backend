import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_instructors_studentOrderByInput } from "../../../inputs/Subcourse_instructors_studentOrderByInput";
import { Subcourse_instructors_studentWhereInput } from "../../../inputs/Subcourse_instructors_studentWhereInput";
import { Subcourse_instructors_studentWhereUniqueInput } from "../../../inputs/Subcourse_instructors_studentWhereUniqueInput";
import { Subcourse_instructors_studentScalarFieldEnum } from "../../../../enums/Subcourse_instructors_studentScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstSubcourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereInput, {
    nullable: true
  })
  where?: Subcourse_instructors_studentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentOrderByInput], {
    nullable: true
  })
  orderBy?: Subcourse_instructors_studentOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereUniqueInput, {
    nullable: true
  })
  cursor?: Subcourse_instructors_studentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"subcourseId" | "studentId"> | undefined;
}
