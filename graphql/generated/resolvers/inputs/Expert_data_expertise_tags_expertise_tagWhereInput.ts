import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataRelationFilter } from "../inputs/Expert_dataRelationFilter";
import { Expertise_tagRelationFilter } from "../inputs/Expertise_tagRelationFilter";
import { IntFilter } from "../inputs/IntFilter";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagWhereInput", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagWhereInput {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagWhereInput], {
    nullable: true
  })
  AND?: Expert_data_expertise_tags_expertise_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagWhereInput], {
    nullable: true
  })
  OR?: Expert_data_expertise_tags_expertise_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagWhereInput], {
    nullable: true
  })
  NOT?: Expert_data_expertise_tags_expertise_tagWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  expertDataId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  expertiseTagId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => Expert_dataRelationFilter, {
    nullable: true
  })
  expert_data?: Expert_dataRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagRelationFilter, {
    nullable: true
  })
  expertise_tag?: Expertise_tagRelationFilter | undefined;
}
