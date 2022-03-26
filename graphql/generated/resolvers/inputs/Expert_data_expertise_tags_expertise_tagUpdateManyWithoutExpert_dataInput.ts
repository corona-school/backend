import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope";
import { Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpert_dataInput";
import { Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput";
import { Expert_data_expertise_tags_expertise_tagScalarWhereInput } from "../inputs/Expert_data_expertise_tags_expertise_tagScalarWhereInput";
import { Expert_data_expertise_tags_expertise_tagUpdateManyWithWhereWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpdateManyWithWhereWithoutExpert_dataInput";
import { Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpert_dataInput";
import { Expert_data_expertise_tags_expertise_tagUpsertWithWhereUniqueWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpsertWithWhereUniqueWithoutExpert_dataInput";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpert_dataInput", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpert_dataInput {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput], {
    nullable: true
  })
  create?: Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpert_dataInput], {
    nullable: true
  })
  connectOrCreate?: Expert_data_expertise_tags_expertise_tagCreateOrConnectWithoutExpert_dataInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagUpsertWithWhereUniqueWithoutExpert_dataInput], {
    nullable: true
  })
  upsert?: Expert_data_expertise_tags_expertise_tagUpsertWithWhereUniqueWithoutExpert_dataInput[] | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope, {
    nullable: true
  })
  createMany?: Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpert_dataInput], {
    nullable: true
  })
  update?: Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpert_dataInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagUpdateManyWithWhereWithoutExpert_dataInput], {
    nullable: true
  })
  updateMany?: Expert_data_expertise_tags_expertise_tagUpdateManyWithWhereWithoutExpert_dataInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Expert_data_expertise_tags_expertise_tagScalarWhereInput[] | undefined;
}
