import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingOrderByInput } from "../../../inputs/Bbb_meetingOrderByInput";
import { Bbb_meetingWhereInput } from "../../../inputs/Bbb_meetingWhereInput";
import { Bbb_meetingWhereUniqueInput } from "../../../inputs/Bbb_meetingWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateBbb_meetingArgs {
  @TypeGraphQL.Field(_type => Bbb_meetingWhereInput, {
    nullable: true
  })
  where?: Bbb_meetingWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Bbb_meetingOrderByInput], {
    nullable: true
  })
  orderBy?: Bbb_meetingOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Bbb_meetingWhereUniqueInput, {
    nullable: true
  })
  cursor?: Bbb_meetingWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
