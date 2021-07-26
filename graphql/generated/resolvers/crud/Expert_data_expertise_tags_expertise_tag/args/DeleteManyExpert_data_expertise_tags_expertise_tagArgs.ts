import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_data_expertise_tags_expertise_tagWhereInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyExpert_data_expertise_tags_expertise_tagArgs {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereInput, {
    nullable: true
  })
  where?: Expert_data_expertise_tags_expertise_tagWhereInput | undefined;
}
