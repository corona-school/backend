import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_guestCreateInput } from "../../../inputs/Course_guestCreateInput";
import { Course_guestUpdateInput } from "../../../inputs/Course_guestUpdateInput";
import { Course_guestWhereUniqueInput } from "../../../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertCourse_guestArgs {
  @TypeGraphQL.Field(_type => Course_guestWhereUniqueInput, {
    nullable: false
  })
  where!: Course_guestWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_guestCreateInput, {
    nullable: false
  })
  create!: Course_guestCreateInput;

  @TypeGraphQL.Field(_type => Course_guestUpdateInput, {
    nullable: false
  })
  update!: Course_guestUpdateInput;
}
