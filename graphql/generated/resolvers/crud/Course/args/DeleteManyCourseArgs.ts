import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseWhereInput } from "../../../inputs/CourseWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyCourseArgs {
  @TypeGraphQL.Field(_type => CourseWhereInput, {
    nullable: true
  })
  where?: CourseWhereInput | undefined;
}
