import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpertise_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expertise_tagCreateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpertise_tagInput, {
    nullable: true
  })
  expert_data_expertise_tags_expertise_tag?: Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpertise_tagInput | undefined;
}
