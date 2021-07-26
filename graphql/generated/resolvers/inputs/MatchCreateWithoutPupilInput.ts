import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutMatchInput } from "../inputs/StudentCreateNestedOneWithoutMatchInput";
import { match_source_enum } from "../../enums/match_source_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MatchCreateWithoutPupilInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  dissolved?: boolean | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  proposedTime?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => match_source_enum, {
    nullable: true
  })
  source?: "imported" | "matchedexternal" | "matchedinternal" | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  dissolveReason?: number | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  feedbackToPupilMail?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  feedbackToStudentMail?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  followUpToPupilMail?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  followUpToStudentMail?: boolean | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutMatchInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutMatchInput | undefined;
}
