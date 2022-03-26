import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expertise_tagAvgAggregate } from "../outputs/Expertise_tagAvgAggregate";
import { Expertise_tagCountAggregate } from "../outputs/Expertise_tagCountAggregate";
import { Expertise_tagMaxAggregate } from "../outputs/Expertise_tagMaxAggregate";
import { Expertise_tagMinAggregate } from "../outputs/Expertise_tagMinAggregate";
import { Expertise_tagSumAggregate } from "../outputs/Expertise_tagSumAggregate";

@TypeGraphQL.ObjectType("Expertise_tagGroupBy", {
  isAbstract: true
})
export class Expertise_tagGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => Expertise_tagCountAggregate, {
    nullable: true
  })
  _count!: Expertise_tagCountAggregate | null;

  @TypeGraphQL.Field(_type => Expertise_tagAvgAggregate, {
    nullable: true
  })
  _avg!: Expertise_tagAvgAggregate | null;

  @TypeGraphQL.Field(_type => Expertise_tagSumAggregate, {
    nullable: true
  })
  _sum!: Expertise_tagSumAggregate | null;

  @TypeGraphQL.Field(_type => Expertise_tagMinAggregate, {
    nullable: true
  })
  _min!: Expertise_tagMinAggregate | null;

  @TypeGraphQL.Field(_type => Expertise_tagMaxAggregate, {
    nullable: true
  })
  _max!: Expertise_tagMaxAggregate | null;
}
