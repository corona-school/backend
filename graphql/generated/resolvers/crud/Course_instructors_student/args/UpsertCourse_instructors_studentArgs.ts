import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_instructors_studentCreateInput } from "../../../inputs/Course_instructors_studentCreateInput";
import { Course_instructors_studentUpdateInput } from "../../../inputs/Course_instructors_studentUpdateInput";
import { Course_instructors_studentWhereUniqueInput } from "../../../inputs/Course_instructors_studentWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertCourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Course_instructors_studentWhereUniqueInput, {
    nullable: false
  })
  where!: Course_instructors_studentWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_instructors_studentCreateInput, {
    nullable: false
  })
  create!: Course_instructors_studentCreateInput;

  @TypeGraphQL.Field(_type => Course_instructors_studentUpdateInput, {
    nullable: false
  })
  update!: Course_instructors_studentUpdateInput;
}
