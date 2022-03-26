import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagAvgAggregate } from "../outputs/Expert_data_expertise_tags_expertise_tagAvgAggregate";
import { Expert_data_expertise_tags_expertise_tagCountAggregate } from "../outputs/Expert_data_expertise_tags_expertise_tagCountAggregate";
import { Expert_data_expertise_tags_expertise_tagMaxAggregate } from "../outputs/Expert_data_expertise_tags_expertise_tagMaxAggregate";
import { Expert_data_expertise_tags_expertise_tagMinAggregate } from "../outputs/Expert_data_expertise_tags_expertise_tagMinAggregate";
import { Expert_data_expertise_tags_expertise_tagSumAggregate } from "../outputs/Expert_data_expertise_tags_expertise_tagSumAggregate";

@TypeGraphQL.ObjectType("Expert_data_expertise_tags_expertise_tagGroupBy", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  expertDataId!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  expertiseTagId!: number;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCountAggregate, {
    nullable: true
  })
  _count!: Expert_data_expertise_tags_expertise_tagCountAggregate | null;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagAvgAggregate, {
    nullable: true
  })
  _avg!: Expert_data_expertise_tags_expertise_tagAvgAggregate | null;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagSumAggregate, {
    nullable: true
  })
  _sum!: Expert_data_expertise_tags_expertise_tagSumAggregate | null;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagMinAggregate, {
    nullable: true
  })
  _min!: Expert_data_expertise_tags_expertise_tagMinAggregate | null;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagMaxAggregate, {
    nullable: true
  })
  _max!: Expert_data_expertise_tags_expertise_tagMaxAggregate | null;
}
