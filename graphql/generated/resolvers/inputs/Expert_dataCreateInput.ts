import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpert_dataInput";
import { StudentCreateNestedOneWithoutExpert_dataInput } from "../inputs/StudentCreateNestedOneWithoutExpert_dataInput";
import { expert_data_allowed_enum } from "../../enums/expert_data_allowed_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_dataCreateInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  contactEmail!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  active?: boolean | undefined;

  @TypeGraphQL.Field(_type => expert_data_allowed_enum, {
    nullable: true
  })
  allowed?: "pending" | "yes" | "no" | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutExpert_dataInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutExpert_dataInput | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpert_dataInput, {
    nullable: true
  })
  expert_data_expertise_tags_expertise_tag?: Expert_data_expertise_tags_expertise_tagCreateNestedManyWithoutExpert_dataInput | undefined;
}
