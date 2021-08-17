import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_instructors_studentWhereInput } from "../../../inputs/Course_instructors_studentWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyCourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Course_instructors_studentWhereInput, {
    nullable: true
  })
  where?: Course_instructors_studentWhereInput | undefined;
}
