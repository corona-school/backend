import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseUpdateManyMutationInput } from "../../../inputs/CourseUpdateManyMutationInput";
import { CourseWhereInput } from "../../../inputs/CourseWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyCourseArgs {
  @TypeGraphQL.Field(_type => CourseUpdateManyMutationInput, {
    nullable: false
  })
  data!: CourseUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  where?: CourseWhereInput | undefined;
}
