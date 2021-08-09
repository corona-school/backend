import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { CourseCreateManyInput } from "../../../inputs/CourseCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyCourseArgs {
  @TypeGraphQL.Field(_type => [CourseCreateManyInput], {
    nullable: false
  })
  data!: CourseCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
