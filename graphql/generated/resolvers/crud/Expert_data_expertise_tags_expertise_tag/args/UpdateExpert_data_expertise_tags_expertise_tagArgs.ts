import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_data_expertise_tags_expertise_tagUpdateInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagUpdateInput";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateExpert_data_expertise_tags_expertise_tagArgs {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagUpdateInput, {
    nullable: false
  })
  data!: Expert_data_expertise_tags_expertise_tagUpdateInput;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Expert_data_expertise_tags_expertise_tagWhereUniqueInput;
}
