import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Pupil } from "../models/Pupil";
import { Student } from "../models/Student";
import { match_source_enum } from "../enums/match_source_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Match {
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

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  dissolveReason?: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  proposedTime?: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

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

  @TypeGraphQL.Field(_type => match_source_enum, {
    nullable: false
  })
  source!: "imported" | "matchedexternal" | "matchedinternal";

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  pupilId?: number | null;

  pupil?: Pupil | null;

  student?: Student | null;
}
