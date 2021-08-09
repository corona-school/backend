import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateAvgAggregate } from "../outputs/Participation_certificateAvgAggregate";
import { Participation_certificateCountAggregate } from "../outputs/Participation_certificateCountAggregate";
import { Participation_certificateMaxAggregate } from "../outputs/Participation_certificateMaxAggregate";
import { Participation_certificateMinAggregate } from "../outputs/Participation_certificateMinAggregate";
import { Participation_certificateSumAggregate } from "../outputs/Participation_certificateSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Participation_certificateGroupBy {
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
  signaturePupil!: Buffer | null;

  @TypeGraphQL.Field(_type => GraphQLScalars.ByteResolver, {
    nullable: true
  })
  signatureParent!: Buffer | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  signatureLocation!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  signatureDate!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  pupilId!: number | null;

  @TypeGraphQL.Field(_type => Participation_certificateCountAggregate, {
    nullable: true
  })
  _count!: Participation_certificateCountAggregate | null;

  @TypeGraphQL.Field(_type => Participation_certificateAvgAggregate, {
    nullable: true
  })
  _avg!: Participation_certificateAvgAggregate | null;

  @TypeGraphQL.Field(_type => Participation_certificateSumAggregate, {
    nullable: true
  })
  _sum!: Participation_certificateSumAggregate | null;

  @TypeGraphQL.Field(_type => Participation_certificateMinAggregate, {
    nullable: true
  })
  _min!: Participation_certificateMinAggregate | null;

  @TypeGraphQL.Field(_type => Participation_certificateMaxAggregate, {
    nullable: true
  })
  _max!: Participation_certificateMaxAggregate | null;
}
