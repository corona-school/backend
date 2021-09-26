import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_instructors_studentCreateManyInput } from "../../../inputs/Course_instructors_studentCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyCourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => [Course_instructors_studentCreateManyInput], {
    nullable: false
  })
  data!: Course_instructors_studentCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
