import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorCreateManyInput } from "../../../inputs/MentorCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyMentorArgs {
  @TypeGraphQL.Field(_type => [MentorCreateManyInput], {
    nullable: false
  })
  data!: MentorCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
