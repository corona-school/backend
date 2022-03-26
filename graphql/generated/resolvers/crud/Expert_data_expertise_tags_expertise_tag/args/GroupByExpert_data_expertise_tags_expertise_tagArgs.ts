import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_data_expertise_tags_expertise_tagOrderByWithAggregationInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagOrderByWithAggregationInput";
import { Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput";
import { Expert_data_expertise_tags_expertise_tagWhereInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagWhereInput";
import { Expert_data_expertise_tags_expertise_tagScalarFieldEnum } from "../../../../enums/Expert_data_expertise_tags_expertise_tagScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByExpert_data_expertise_tags_expertise_tagArgs {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereInput, {
    nullable: true
  })
  where?: Expert_data_expertise_tags_expertise_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Expert_data_expertise_tags_expertise_tagOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"expertDataId" | "expertiseTagId">;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
