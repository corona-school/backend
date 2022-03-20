import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingOrderByWithRelationInput } from "../../../inputs/Bbb_meetingOrderByWithRelationInput";
import { Bbb_meetingWhereInput } from "../../../inputs/Bbb_meetingWhereInput";
import { Bbb_meetingWhereUniqueInput } from "../../../inputs/Bbb_meetingWhereUniqueInput";
import { Bbb_meetingScalarFieldEnum } from "../../../../enums/Bbb_meetingScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyBbb_meetingArgs {
  @TypeGraphQL.Field(_type => Bbb_meetingWhereInput, {
    nullable: true
  })
  where?: Bbb_meetingWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Bbb_meetingOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Bbb_meetingOrderByWithRelationInput[] | undefined;

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

  @TypeGraphQL.Field(_type => [Bbb_meetingScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "meetingID" | "meetingName" | "attendeePW" | "moderatorPW" | "alternativeUrl"> | undefined;
}
