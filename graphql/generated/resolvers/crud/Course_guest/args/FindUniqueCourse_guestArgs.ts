import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_guestWhereUniqueInput } from "../../../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueCourse_guestArgs {
  @TypeGraphQL.Field(_type => Course_guestWhereUniqueInput, {
    nullable: false
  })
  where!: Course_guestWhereUniqueInput;
}
