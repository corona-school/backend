import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("Course_tagScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Course_tagScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Course_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Course_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Course_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Course_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  identifier?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  name?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  category?: StringWithAggregatesFilter | undefined;
}
