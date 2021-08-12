import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorWhereInput } from "../../../inputs/MentorWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyMentorArgs {
  @TypeGraphQL.Field(_type => MentorWhereInput, {
    nullable: true
  })
  where?: MentorWhereInput | undefined;
}
