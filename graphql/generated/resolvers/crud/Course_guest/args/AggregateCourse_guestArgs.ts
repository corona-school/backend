import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_guestOrderByWithRelationInput } from "../../../inputs/Course_guestOrderByWithRelationInput";
import { Course_guestWhereInput } from "../../../inputs/Course_guestWhereInput";
import { Course_guestWhereUniqueInput } from "../../../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateCourse_guestArgs {
  @TypeGraphQL.Field(_type => Course_guestWhereInput, {
    nullable: true
  })
  where?: Course_guestWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_guestOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Course_guestOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_guestWhereUniqueInput, {
    nullable: true
  })
  cursor?: Course_guestWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
