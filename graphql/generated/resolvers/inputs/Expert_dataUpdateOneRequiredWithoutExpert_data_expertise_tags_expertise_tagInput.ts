import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataCreateOrConnectWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expert_dataCreateOrConnectWithoutExpert_data_expertise_tags_expertise_tagInput";
import { Expert_dataCreateWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expert_dataCreateWithoutExpert_data_expertise_tags_expertise_tagInput";
import { Expert_dataUpdateWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expert_dataUpdateWithoutExpert_data_expertise_tags_expertise_tagInput";
import { Expert_dataUpsertWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expert_dataUpsertWithoutExpert_data_expertise_tags_expertise_tagInput";
import { Expert_dataWhereUniqueInput } from "../inputs/Expert_dataWhereUniqueInput";

@TypeGraphQL.InputType("Expert_dataUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput", {
  isAbstract: true
})
export class Expert_dataUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput {
  @TypeGraphQL.Field(_type => Expert_dataCreateWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: true
  })
  create?: Expert_dataCreateWithoutExpert_data_expertise_tags_expertise_tagInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataCreateOrConnectWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: true
  })
  connectOrCreate?: Expert_dataCreateOrConnectWithoutExpert_data_expertise_tags_expertise_tagInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataUpsertWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: true
  })
  upsert?: Expert_dataUpsertWithoutExpert_data_expertise_tags_expertise_tagInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataWhereUniqueInput, {
    nullable: true
  })
  connect?: Expert_dataWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataUpdateWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: true
  })
  update?: Expert_dataUpdateWithoutExpert_data_expertise_tags_expertise_tagInput | undefined;
}
