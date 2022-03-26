import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Expert_data_expertise_tags_expertise_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  expertDataId?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  expertiseTagId?: IntWithAggregatesFilter | undefined;
}
