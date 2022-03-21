import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataAvgAggregate } from "../outputs/Expert_dataAvgAggregate";
import { Expert_dataCountAggregate } from "../outputs/Expert_dataCountAggregate";
import { Expert_dataMaxAggregate } from "../outputs/Expert_dataMaxAggregate";
import { Expert_dataMinAggregate } from "../outputs/Expert_dataMinAggregate";
import { Expert_dataSumAggregate } from "../outputs/Expert_dataSumAggregate";
import { expert_data_allowed_enum } from "../../enums/expert_data_allowed_enum";

@TypeGraphQL.ObjectType("Expert_dataGroupBy", {
  isAbstract: true
})
export class Expert_dataGroupBy {
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
    nullable: false
  })
  contactEmail!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  active!: boolean;

  @TypeGraphQL.Field(_type => expert_data_allowed_enum, {
    nullable: false
  })
  allowed!: "pending" | "yes" | "no";

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId!: number | null;

  @TypeGraphQL.Field(_type => Expert_dataCountAggregate, {
    nullable: true
  })
  _count!: Expert_dataCountAggregate | null;

  @TypeGraphQL.Field(_type => Expert_dataAvgAggregate, {
    nullable: true
  })
  _avg!: Expert_dataAvgAggregate | null;

  @TypeGraphQL.Field(_type => Expert_dataSumAggregate, {
    nullable: true
  })
  _sum!: Expert_dataSumAggregate | null;

  @TypeGraphQL.Field(_type => Expert_dataMinAggregate, {
    nullable: true
  })
  _min!: Expert_dataMinAggregate | null;

  @TypeGraphQL.Field(_type => Expert_dataMaxAggregate, {
    nullable: true
  })
  _max!: Expert_dataMaxAggregate | null;
}
