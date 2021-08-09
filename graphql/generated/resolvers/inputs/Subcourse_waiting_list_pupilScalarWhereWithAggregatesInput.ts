import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  subcourseId?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  pupilId?: IntWithAggregatesFilter | undefined;
}
