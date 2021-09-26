import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductScalarWhereInput {
  @TypeGraphQL.Field(_type => [Certificate_of_conductScalarWhereInput], {
    nullable: true
  })
  AND?: Certificate_of_conductScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductScalarWhereInput], {
    nullable: true
  })
  OR?: Certificate_of_conductScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductScalarWhereInput], {
    nullable: true
  })
  NOT?: Certificate_of_conductScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  dateOfInspection?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  dateOfIssue?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  criminalRecords?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  inspectingScreenerId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  studentId?: IntNullableFilter | undefined;
}
