import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { DateTimeNullableFilter } from "../inputs/DateTimeNullableFilter";
import { EnumlanguageNullableListFilter } from "../inputs/EnumlanguageNullableListFilter";
import { Enumlearning_german_sinceNullableFilter } from "../inputs/Enumlearning_german_sinceNullableFilter";
import { Enumpupil_projectfields_enumNullableListFilter } from "../inputs/Enumpupil_projectfields_enumNullableListFilter";
import { Enumpupil_registrationsource_enumFilter } from "../inputs/Enumpupil_registrationsource_enumFilter";
import { Enumpupil_schooltype_enumFilter } from "../inputs/Enumpupil_schooltype_enumFilter";
import { Enumpupil_state_enumFilter } from "../inputs/Enumpupil_state_enumFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilScalarWhereInput {
  @TypeGraphQL.Field(_type => [PupilScalarWhereInput], {
    nullable: true
  })
  AND?: PupilScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilScalarWhereInput], {
    nullable: true
  })
  OR?: PupilScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilScalarWhereInput], {
    nullable: true
  })
  NOT?: PupilScalarWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  firstname?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  lastname?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  active?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  email?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  verification?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  wix_id?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  wix_creation_date?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  subjects?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  msg?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  grade?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  verifiedAt?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  authToken?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  authTokenUsed?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  authTokenSent?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  openMatchRequestCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  matchingPriority?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_schooltype_enumFilter, {
    nullable: true
  })
  schooltype?: Enumpupil_schooltype_enumFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  newsletter?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isPupil?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isParticipant?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_state_enumFilter, {
    nullable: true
  })
  state?: Enumpupil_state_enumFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  teacherEmailAddress?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_registrationsource_enumFilter, {
    nullable: true
  })
  registrationSource?: Enumpupil_registrationsource_enumFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  schoolId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isProjectCoachee?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_projectfields_enumNullableListFilter, {
    nullable: true
  })
  projectFields?: Enumpupil_projectfields_enumNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  isJufoParticipant?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  openProjectMatchRequestCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  projectMemberCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => EnumlanguageNullableListFilter, {
    nullable: true
  })
  languages?: EnumlanguageNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => Enumlearning_german_sinceNullableFilter, {
    nullable: true
  })
  learningGermanSince?: Enumlearning_german_sinceNullableFilter | undefined;
}
