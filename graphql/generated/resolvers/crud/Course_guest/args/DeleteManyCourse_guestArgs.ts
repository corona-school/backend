import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_guestWhereInput } from "../../../inputs/Course_guestWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyCourse_guestArgs {
  @TypeGraphQL.Field(_type => Course_guestWhereInput, {
    nullable: true
  })
  where?: Course_guestWhereInput | undefined;
}
