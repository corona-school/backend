import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorCreateInput } from "../../../inputs/MentorCreateInput";
import { MentorUpdateInput } from "../../../inputs/MentorUpdateInput";
import { MentorWhereUniqueInput } from "../../../inputs/MentorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertMentorArgs {
  @TypeGraphQL.Field(_type => MentorWhereUniqueInput, {
    nullable: false
  })
  where!: MentorWhereUniqueInput;

  @TypeGraphQL.Field(_type => MentorCreateInput, {
    nullable: false
  })
  create!: MentorCreateInput;

  @TypeGraphQL.Field(_type => MentorUpdateInput, {
    nullable: false
  })
  update!: MentorUpdateInput;
}
