import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInputEnvelope } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInputEnvelope";
import { Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpertise_tagInput";
import { Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpertise_tagInput {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput], {
    nullable: true
  })
  create?: Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpertise_tagInput], {
    nullable: true
  })
  connectOrCreate?: Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpertise_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInputEnvelope, {
    nullable: true
  })
  createMany?: Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagWhereUniqueInput], {
    nullable: true
  })
  connect?: Expert_data_expertise_tags_expertise_tagWhereUniqueInput[] | undefined;
}
