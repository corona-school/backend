import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseOrderByInput } from "../../../inputs/CourseOrderByInput";
import { CourseScalarWhereWithAggregatesInput } from "../../../inputs/CourseScalarWhereWithAggregatesInput";
import { CourseWhereInput } from "../../../inputs/CourseWhereInput";
import { CourseScalarFieldEnum } from "../../../../enums/CourseScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByCourseArgs {
  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  where?: CourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => [CourseOrderByInput], {
    nullable: true
  })
  orderBy?: CourseOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "name" | "outline" | "description" | "imageKey" | "courseState" | "category" | "screeningComment" | "publicRanking" | "allowContact" | "correspondentId">;

  @TypeGraphQL.Field(_type => CourseScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: CourseScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
