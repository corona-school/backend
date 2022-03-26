import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput";
import { Expertise_tagWhereUniqueInput } from "../inputs/Expertise_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expertise_tagCreateOrConnectWithoutExpert_data_expertise_tags_expertise_tagInput {
  @TypeGraphQL.Field(_type => Expertise_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Expertise_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: false
  })
  create!: Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput;
}
