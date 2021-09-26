import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseOrderByInput } from "../../../inputs/CourseOrderByInput";
import { CourseWhereInput } from "../../../inputs/CourseWhereInput";
import { CourseWhereUniqueInput } from "../../../inputs/CourseWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateCourseArgs {
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
}
