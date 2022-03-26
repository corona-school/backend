import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataOrderByWithRelationInput } from "../inputs/Expert_dataOrderByWithRelationInput";
import { Expertise_tagOrderByWithRelationInput } from "../inputs/Expertise_tagOrderByWithRelationInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagOrderByWithRelationInput", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagOrderByWithRelationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  expertDataId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  expertiseTagId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Expert_dataOrderByWithRelationInput, {
    nullable: true
  })
  expert_data?: Expert_dataOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagOrderByWithRelationInput, {
    nullable: true
  })
  expertise_tag?: Expertise_tagOrderByWithRelationInput | undefined;
}
