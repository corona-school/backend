import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expertise_tagOrderByWithAggregationInput } from "../../../inputs/Expertise_tagOrderByWithAggregationInput";
import { Expertise_tagScalarWhereWithAggregatesInput } from "../../../inputs/Expertise_tagScalarWhereWithAggregatesInput";
import { Expertise_tagWhereInput } from "../../../inputs/Expertise_tagWhereInput";
import { Expertise_tagScalarFieldEnum } from "../../../../enums/Expertise_tagScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByExpertise_tagArgs {
  @TypeGraphQL.Field(_type => Expertise_tagWhereInput, {
    nullable: true
  })
  where?: Expertise_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Expertise_tagOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Expertise_tagOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expertise_tagScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "name">;

  @TypeGraphQL.Field(_type => Expertise_tagScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Expertise_tagScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
