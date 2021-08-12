import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataAvgAggregate } from "../outputs/Expert_dataAvgAggregate";
import { Expert_dataCountAggregate } from "../outputs/Expert_dataCountAggregate";
import { Expert_dataMaxAggregate } from "../outputs/Expert_dataMaxAggregate";
import { Expert_dataMinAggregate } from "../outputs/Expert_dataMinAggregate";
import { Expert_dataSumAggregate } from "../outputs/Expert_dataSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class AggregateExpert_data {
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
