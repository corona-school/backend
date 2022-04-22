import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType("Subcourse_participants_pupilScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Subcourse_participants_pupilScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Subcourse_participants_pupilScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Subcourse_participants_pupilScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  subcourseId?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  pupilId?: IntWithAggregatesFilter | undefined;
}
