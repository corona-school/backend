import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagWhereUniqueInput } from "../../../inputs/Course_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteCourse_tagArgs {
  @TypeGraphQL.Field(_type => Course_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Course_tagWhereUniqueInput;
}
