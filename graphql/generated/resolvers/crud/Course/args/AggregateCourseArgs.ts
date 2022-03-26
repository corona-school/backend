import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseOrderByWithRelationInput } from "../../../inputs/CourseOrderByWithRelationInput";
import { CourseWhereInput } from "../../../inputs/CourseWhereInput";
import { CourseWhereUniqueInput } from "../../../inputs/CourseWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateCourseArgs {
  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  where?: CourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => [CourseOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: CourseOrderByWithRelationInput[] | undefined;

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
}
