import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_instructors_studentOrderByWithRelationInput } from "../../../inputs/Course_instructors_studentOrderByWithRelationInput";
import { Course_instructors_studentWhereInput } from "../../../inputs/Course_instructors_studentWhereInput";
import { Course_instructors_studentWhereUniqueInput } from "../../../inputs/Course_instructors_studentWhereUniqueInput";
import { Course_instructors_studentScalarFieldEnum } from "../../../../enums/Course_instructors_studentScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyCourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Course_instructors_studentWhereInput, {
    nullable: true
  })
  where?: Course_instructors_studentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Course_instructors_studentOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentWhereUniqueInput, {
    nullable: true
  })
  cursor?: Course_instructors_studentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"courseId" | "studentId"> | undefined;
}
