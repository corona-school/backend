import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpert_dataInput {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Expert_data_expertise_tags_expertise_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput, {
    nullable: false
  })
  create!: Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput;
}
