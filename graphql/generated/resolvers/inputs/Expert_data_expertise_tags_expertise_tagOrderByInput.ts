import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagOrderByInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  expertDataId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  expertiseTagId?: "asc" | "desc" | undefined;
}
