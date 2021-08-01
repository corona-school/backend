import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseOrderByInput } from "../../../inputs/CourseOrderByInput";
import { CourseWhereInput } from "../../../inputs/CourseWhereInput";
import { CourseWhereUniqueInput } from "../../../inputs/CourseWhereUniqueInput";
import { CourseScalarFieldEnum } from "../../../../enums/CourseScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstCourseArgs {
  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  where?: CourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => [CourseOrderByInput], {
    nullable: true
  })
  orderBy?: CourseOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: true
  })
  cursor?: CourseWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [CourseScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "name" | "outline" | "description" | "imageKey" | "category" | "courseState" | "screeningComment" | "publicRanking" | "allowContact" | "correspondentId"> | undefined;
}
