import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInput";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInputEnvelope {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInput], {
    nullable: false
  })
  data!: Expert_data_expertise_tags_expertise_tagCreateManyExpert_dataInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
