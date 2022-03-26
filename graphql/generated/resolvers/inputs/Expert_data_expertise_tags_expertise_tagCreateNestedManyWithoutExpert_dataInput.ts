import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope";
import { Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpert_dataInput";
import { Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpert_dataInput {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput], {
    nullable: true
  })
  create?: Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpert_dataInput], {
    nullable: true
  })
  connectOrCreate?: Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpert_dataInput[] | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope, {
    nullable: true
  })
  createMany?: Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagWhereUniqueInput], {
    nullable: true
  })
  connect?: Expert_data_expertise_tags_expertise_tagWhereUniqueInput[] | undefined;
}
