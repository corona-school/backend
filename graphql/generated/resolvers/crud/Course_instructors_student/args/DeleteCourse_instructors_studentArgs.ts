import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_instructors_studentWhereUniqueInput } from "../../../inputs/Course_instructors_studentWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteCourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Course_instructors_studentWhereUniqueInput, {
    nullable: false
  })
  where!: Course_instructors_studentWhereUniqueInput;
}
