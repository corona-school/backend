import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_attendance_logCreateManyInput } from "../../../inputs/Course_attendance_logCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyCourse_attendance_logArgs {
  @TypeGraphQL.Field(_type => [Course_attendance_logCreateManyInput], {
    nullable: false
  })
  data!: Course_attendance_logCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
