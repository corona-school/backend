import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingOrderByInput } from "../../../inputs/Bbb_meetingOrderByInput";
import { Bbb_meetingScalarWhereWithAggregatesInput } from "../../../inputs/Bbb_meetingScalarWhereWithAggregatesInput";
import { Bbb_meetingWhereInput } from "../../../inputs/Bbb_meetingWhereInput";
import { Bbb_meetingScalarFieldEnum } from "../../../../enums/Bbb_meetingScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByBbb_meetingArgs {
  @TypeGraphQL.Field(_type => Bbb_meetingWhereInput, {
    nullable: true
  })
  where?: Bbb_meetingWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Bbb_meetingOrderByInput], {
    nullable: true
  })
  orderBy?: Bbb_meetingOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Bbb_meetingScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "meetingID" | "meetingName" | "attendeePW" | "moderatorPW" | "alternativeUrl">;

  @TypeGraphQL.Field(_type => Bbb_meetingScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Bbb_meetingScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
