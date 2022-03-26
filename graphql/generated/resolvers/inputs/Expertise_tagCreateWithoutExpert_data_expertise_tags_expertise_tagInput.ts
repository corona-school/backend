import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput", {
  isAbstract: true
})
export class Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;
}
