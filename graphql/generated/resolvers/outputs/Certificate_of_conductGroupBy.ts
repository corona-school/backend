import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductAvgAggregate } from "../outputs/Certificate_of_conductAvgAggregate";
import { Certificate_of_conductCountAggregate } from "../outputs/Certificate_of_conductCountAggregate";
import { Certificate_of_conductMaxAggregate } from "../outputs/Certificate_of_conductMaxAggregate";
import { Certificate_of_conductMinAggregate } from "../outputs/Certificate_of_conductMinAggregate";
import { Certificate_of_conductSumAggregate } from "../outputs/Certificate_of_conductSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Certificate_of_conductGroupBy {
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

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  dateOfInspection!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  dateOfIssue!: Date;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  criminalRecords!: boolean;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  inspectingScreenerId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId!: number | null;

  @TypeGraphQL.Field(_type => Certificate_of_conductCountAggregate, {
    nullable: true
  })
  _count!: Certificate_of_conductCountAggregate | null;

  @TypeGraphQL.Field(_type => Certificate_of_conductAvgAggregate, {
    nullable: true
  })
  _avg!: Certificate_of_conductAvgAggregate | null;

  @TypeGraphQL.Field(_type => Certificate_of_conductSumAggregate, {
    nullable: true
  })
  _sum!: Certificate_of_conductSumAggregate | null;

  @TypeGraphQL.Field(_type => Certificate_of_conductMinAggregate, {
    nullable: true
  })
  _min!: Certificate_of_conductMinAggregate | null;

  @TypeGraphQL.Field(_type => Certificate_of_conductMaxAggregate, {
    nullable: true
  })
  _max!: Certificate_of_conductMaxAggregate | null;
}
