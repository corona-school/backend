import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_guestCreateInput } from "../../../inputs/Course_guestCreateInput";

@TypeGraphQL.ArgsType()
export class CreateCourse_guestArgs {
  @TypeGraphQL.Field(_type => Course_guestCreateInput, {
    nullable: false
  })
  data!: Course_guestCreateInput;
}
