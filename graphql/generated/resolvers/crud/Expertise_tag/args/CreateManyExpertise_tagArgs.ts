import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expertise_tagCreateManyInput } from "../../../inputs/Expertise_tagCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyExpertise_tagArgs {
  @TypeGraphQL.Field(_type => [Expertise_tagCreateManyInput], {
    nullable: false
  })
  data!: Expertise_tagCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
