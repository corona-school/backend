import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_guestUpdateInput } from "../../../inputs/Course_guestUpdateInput";
import { Course_guestWhereUniqueInput } from "../../../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateCourse_guestArgs {
  @TypeGraphQL.Field(_type => Course_guestUpdateInput, {
    nullable: false
  })
  data!: Course_guestUpdateInput;

  @TypeGraphQL.Field(_type => Course_guestWhereUniqueInput, {
    nullable: false
  })
  where!: Course_guestWhereUniqueInput;
}
