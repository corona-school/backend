import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteExpert_data_expertise_tags_expertise_tagArgs {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Expert_data_expertise_tags_expertise_tagWhereUniqueInput;
}
