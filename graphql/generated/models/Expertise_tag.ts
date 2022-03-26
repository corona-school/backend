import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Expert_data_expertise_tags_expertise_tag } from "../models/Expert_data_expertise_tags_expertise_tag";
import { Expertise_tagCount } from "../resolvers/outputs/Expertise_tagCount";

@TypeGraphQL.ObjectType("Expertise_tag", {
  isAbstract: true
})
export class Expertise_tag {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  expert_data_expertise_tags_expertise_tag?: Expert_data_expertise_tags_expertise_tag[];

  @TypeGraphQL.Field(_type => Expertise_tagCount, {
    nullable: true
  })
  _count?: Expertise_tagCount | null;
}
