import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningUpdateWithoutScreenerInput } from "../inputs/Project_coaching_screeningUpdateWithoutScreenerInput";
import { Project_coaching_screeningWhereUniqueInput } from "../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.InputType("Project_coaching_screeningUpdateWithWhereUniqueWithoutScreenerInput", {
  isAbstract: true
})
export class Project_coaching_screeningUpdateWithWhereUniqueWithoutScreenerInput {
  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Project_coaching_screeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => Project_coaching_screeningUpdateWithoutScreenerInput, {
    nullable: false
  })
  data!: Project_coaching_screeningUpdateWithoutScreenerInput;
}
