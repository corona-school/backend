import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_data_expertise_tags_expertise_tagCreateInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagCreateInput";
import { Expert_data_expertise_tags_expertise_tagUpdateInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagUpdateInput";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertExpert_data_expertise_tags_expertise_tagArgs {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Expert_data_expertise_tags_expertise_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCreateInput, {
    nullable: false
  })
  create!: Expert_data_expertise_tags_expertise_tagCreateInput;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagUpdateInput, {
    nullable: false
  })
  update!: Expert_data_expertise_tags_expertise_tagUpdateInput;
}
