import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_guestUpdateManyMutationInput } from "../../../inputs/Course_guestUpdateManyMutationInput";
import { Course_guestWhereInput } from "../../../inputs/Course_guestWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyCourse_guestArgs {
  @TypeGraphQL.Field(_type => Course_guestUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_guestUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Course_guestWhereInput, {
    nullable: true
  })
  where?: Course_guestWhereInput | undefined;
}
