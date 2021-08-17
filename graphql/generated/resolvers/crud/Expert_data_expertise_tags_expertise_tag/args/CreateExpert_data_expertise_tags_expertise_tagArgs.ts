import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_data_expertise_tags_expertise_tagCreateInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagCreateInput";

@TypeGraphQL.ArgsType()
export class CreateExpert_data_expertise_tags_expertise_tagArgs {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCreateInput, {
    nullable: false
  })
  data!: Expert_data_expertise_tags_expertise_tagCreateInput;
}
