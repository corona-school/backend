import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningCreateWithoutScreenerInput } from "../inputs/Project_coaching_screeningCreateWithoutScreenerInput";
import { Project_coaching_screeningUpdateWithoutScreenerInput } from "../inputs/Project_coaching_screeningUpdateWithoutScreenerInput";
import { Project_coaching_screeningWhereUniqueInput } from "../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.InputType("Project_coaching_screeningUpsertWithWhereUniqueWithoutScreenerInput", {
  isAbstract: true
})
export class Project_coaching_screeningUpsertWithWhereUniqueWithoutScreenerInput {
  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Project_coaching_screeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => Project_coaching_screeningUpdateWithoutScreenerInput, {
    nullable: false
  })
  update!: Project_coaching_screeningUpdateWithoutScreenerInput;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateWithoutScreenerInput, {
    nullable: false
  })
  create!: Project_coaching_screeningCreateWithoutScreenerInput;
}
