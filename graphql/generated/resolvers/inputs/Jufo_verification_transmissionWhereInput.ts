import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Jufo_verification_transmissionWhereInput {
  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionWhereInput], {
    nullable: true
  })
  AND?: Jufo_verification_transmissionWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionWhereInput], {
    nullable: true
  })
  OR?: Jufo_verification_transmissionWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionWhereInput], {
    nullable: true
  })
  NOT?: Jufo_verification_transmissionWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  uuid?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  studentId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;
}
