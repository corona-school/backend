import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expertise_tagCreateOrConnectWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expertise_tagCreateOrConnectWithoutExpert_data_expertise_tags_expertise_tagInput";
import { Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput";
import { Expertise_tagWhereUniqueInput } from "../inputs/Expertise_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expertise_tagCreateNestedOneWithoutExpert_data_expertise_tags_expertise_tagInput {
  @TypeGraphQL.Field(_type => Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: true
  })
  create?: Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagCreateOrConnectWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: true
  })
  connectOrCreate?: Expertise_tagCreateOrConnectWithoutExpert_data_expertise_tags_expertise_tagInput | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagWhereUniqueInput, {
    nullable: true
  })
  connect?: Expertise_tagWhereUniqueInput | undefined;
}
