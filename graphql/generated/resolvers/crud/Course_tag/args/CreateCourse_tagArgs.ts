import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagCreateInput } from "../../../inputs/Course_tagCreateInput";

@TypeGraphQL.ArgsType()
export class CreateCourse_tagArgs {
  @TypeGraphQL.Field(_type => Course_tagCreateInput, {
    nullable: false
  })
  data!: Course_tagCreateInput;
}
