import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Expert_data } from "../models/Expert_data";
import { Expertise_tag } from "../models/Expertise_tag";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tag {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  expertDataId!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  expertiseTagId!: number;

  expert_data?: Expert_data;

  expertise_tag?: Expertise_tag;
}
