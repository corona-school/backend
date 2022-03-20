import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("Jufo_verification_transmissionScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Jufo_verification_transmissionScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Jufo_verification_transmissionScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Jufo_verification_transmissionScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Jufo_verification_transmissionScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  createdAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  uuid?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  studentId?: IntNullableWithAggregatesFilter | undefined;
}
