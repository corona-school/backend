import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MentorAvgAggregate } from "../outputs/MentorAvgAggregate";
import { MentorCountAggregate } from "../outputs/MentorCountAggregate";
import { MentorMaxAggregate } from "../outputs/MentorMaxAggregate";
import { MentorMinAggregate } from "../outputs/MentorMinAggregate";
import { MentorSumAggregate } from "../outputs/MentorSumAggregate";
import { mentor_division_enum } from "../../enums/mentor_division_enum";
import { mentor_expertise_enum } from "../../enums/mentor_expertise_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class MentorGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  firstname!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  lastname!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  active!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  verification!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  verifiedAt!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  authToken!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  authTokenUsed!: boolean;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  authTokenSent!: Date | null;

  @TypeGraphQL.Field(_type => [mentor_division_enum], {
    nullable: true
  })
  division!: Array<"facebook" | "email" | "events" | "video" | "supervision"> | null;

  @TypeGraphQL.Field(_type => [mentor_expertise_enum], {
    nullable: true
  })
  expertise!: Array<"language_difficulties_and_communication" | "specialized_expertise_in_subjects" | "educational_and_didactic_expertise" | "technical_support" | "self_organization"> | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  subjects!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  teachingExperience!: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  message!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  imageUrl!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  wix_id!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  wix_creation_date!: Date;

  @TypeGraphQL.Field(_type => MentorCountAggregate, {
    nullable: true
  })
  _count!: MentorCountAggregate | null;

  @TypeGraphQL.Field(_type => MentorAvgAggregate, {
    nullable: true
  })
  _avg!: MentorAvgAggregate | null;

  @TypeGraphQL.Field(_type => MentorSumAggregate, {
    nullable: true
  })
  _sum!: MentorSumAggregate | null;

  @TypeGraphQL.Field(_type => MentorMinAggregate, {
    nullable: true
  })
  _min!: MentorMinAggregate | null;

  @TypeGraphQL.Field(_type => MentorMaxAggregate, {
    nullable: true
  })
  _max!: MentorMaxAggregate | null;
}
