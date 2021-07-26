import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_data_expertise_tags_expertise_tagCreateManyInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyExpert_data_expertise_tags_expertise_tagArgs {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateManyInput], {
    nullable: false
  })
  data!: Expert_data_expertise_tags_expertise_tagCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
