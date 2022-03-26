import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Pupil } from "../models/Pupil";
import { Student } from "../models/Student";

@TypeGraphQL.ObjectType("Participation_certificate", {
  isAbstract: true
})
export class Participation_certificate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  subjects!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  categories!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  certificateDate!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  startDate!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  endDate!: Date;

  @TypeGraphQL.Field(_type => DecimalJSScalar, {
    nullable: false
  })
  hoursPerWeek!: Prisma.Decimal;

  @TypeGraphQL.Field(_type => DecimalJSScalar, {
    nullable: false
  })
  hoursTotal!: Prisma.Decimal;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  medium!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  ongoingLessons!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  state!: string;

  @TypeGraphQL.Field(_type => GraphQLScalars.ByteResolver, {
    nullable: true
  })
  signaturePupil?: Buffer | null;

  @TypeGraphQL.Field(_type => GraphQLScalars.ByteResolver, {
    nullable: true
  })
  signatureParent?: Buffer | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  signatureLocation?: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  signatureDate?: Date | null;

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
