import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchAvgAggregate } from "../outputs/MatchAvgAggregate";
import { MatchCountAggregate } from "../outputs/MatchCountAggregate";
import { MatchMaxAggregate } from "../outputs/MatchMaxAggregate";
import { MatchMinAggregate } from "../outputs/MatchMinAggregate";
import { MatchSumAggregate } from "../outputs/MatchSumAggregate";
import { match_source_enum } from "../../enums/match_source_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class MatchGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  dissolved!: boolean;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  proposedTime!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => match_source_enum, {
    nullable: false
  })
  source!: "imported" | "matchedexternal" | "matchedinternal";

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  pupilId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  dissolveReason!: number | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  feedbackToPupilMail!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  feedbackToStudentMail!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  followUpToPupilMail!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  followUpToStudentMail!: boolean;

  @TypeGraphQL.Field(_type => MatchCountAggregate, {
    nullable: true
  })
  _count!: MatchCountAggregate | null;

  @TypeGraphQL.Field(_type => MatchAvgAggregate, {
    nullable: true
  })
  _avg!: MatchAvgAggregate | null;

  @TypeGraphQL.Field(_type => MatchSumAggregate, {
    nullable: true
  })
  _sum!: MatchSumAggregate | null;

  @TypeGraphQL.Field(_type => MatchMinAggregate, {
    nullable: true
  })
  _min!: MatchMinAggregate | null;

  @TypeGraphQL.Field(_type => MatchMaxAggregate, {
    nullable: true
  })
  _max!: MatchMaxAggregate | null;
}
