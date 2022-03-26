import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_data_expertise_tags_expertise_tagOrderByWithRelationInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagOrderByWithRelationInput";
import { Expert_data_expertise_tags_expertise_tagWhereInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagWhereInput";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../../../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";
import { Expert_data_expertise_tags_expertise_tagScalarFieldEnum } from "../../../../enums/Expert_data_expertise_tags_expertise_tagScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstExpert_data_expertise_tags_expertise_tagArgs {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereInput, {
    nullable: true
  })
  where?: Expert_data_expertise_tags_expertise_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Expert_data_expertise_tags_expertise_tagOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereUniqueInput, {
    nullable: true
  })
  cursor?: Expert_data_expertise_tags_expertise_tagWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"expertDataId" | "expertiseTagId"> | undefined;
}
