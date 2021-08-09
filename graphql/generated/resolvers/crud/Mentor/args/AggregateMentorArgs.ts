import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorOrderByInput } from "../../../inputs/MentorOrderByInput";
import { MentorWhereInput } from "../../../inputs/MentorWhereInput";
import { MentorWhereUniqueInput } from "../../../inputs/MentorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateMentorArgs {
  @TypeGraphQL.Field(_type => MentorWhereInput, {
    nullable: true
  })
  where?: MentorWhereInput | undefined;

  @TypeGraphQL.Field(_type => [MentorOrderByInput], {
    nullable: true
  })
  orderBy?: MentorOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => MentorWhereUniqueInput, {
    nullable: true
  })
  cursor?: MentorWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
