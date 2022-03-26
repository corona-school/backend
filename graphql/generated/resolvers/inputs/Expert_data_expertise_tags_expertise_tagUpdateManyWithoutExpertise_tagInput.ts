import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInputEnvelope } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInputEnvelope";
import { Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpertise_tagInput";
import { Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput";
import { Expert_data_expertise_tags_expertise_tagScalarWhereInput } from "../inputs/Expert_data_expertise_tags_expertise_tagScalarWhereInput";
import { Expert_data_expertise_tags_expertise_tagUpdateManyWithWhereWithoutExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpdateManyWithWhereWithoutExpertise_tagInput";
import { Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpertise_tagInput";
import { Expert_data_expertise_tags_expertise_tagUpsertWithWhereUniqueWithoutExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpsertWithWhereUniqueWithoutExpertise_tagInput";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpertise_tagInput", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpertise_tagInput {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput], {
    nullable: true
  })
  create?: Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpertise_tagInput], {
    nullable: true
  })
  connectOrCreate?: Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpertise_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagUpsertWithWhereUniqueWithoutExpertise_tagInput], {
    nullable: true
  })
  upsert?: Expert_data_expertise_tags_expertise_tagUpsertWithWhereUniqueWithoutExpertise_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInputEnvelope, {
    nullable: true
  })
  createMany?: Expert_data_expertise_tags_expertise_tagCreateManyExpertise_tagInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagWhereUniqueInput], {
    nullable: true
  })
  set?: Expert_data_expertise_tags_expertise_tagWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Expert_data_expertise_tags_expertise_tagWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagWhereUniqueInput], {
    nullable: true
  })
  delete?: Expert_data_expertise_tags_expertise_tagWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagWhereUniqueInput], {
    nullable: true
  })
  connect?: Expert_data_expertise_tags_expertise_tagWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpertise_tagInput], {
    nullable: true
  })
  update?: Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpertise_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagUpdateManyWithWhereWithoutExpertise_tagInput], {
    nullable: true
  })
  updateMany?: Expert_data_expertise_tags_expertise_tagUpdateManyWithWhereWithoutExpertise_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Expert_data_expertise_tags_expertise_tagScalarWhereInput[] | undefined;
}
