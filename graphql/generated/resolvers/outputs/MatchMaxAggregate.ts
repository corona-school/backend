import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { match_source_enum } from "../../enums/match_source_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class MatchMaxAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  uuid!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  dissolved!: boolean | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  dissolveReason!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  proposedTime!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt!: Date | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  feedbackToPupilMail!: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  feedbackToStudentMail!: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  followUpToPupilMail!: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  followUpToStudentMail!: boolean | null;

  @TypeGraphQL.Field(_type => match_source_enum, {
    nullable: true
  })
  source!: "imported" | "matchedexternal" | "matchedinternal" | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  pupilId!: number | null;
}
