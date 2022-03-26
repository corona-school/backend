import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningCreateManyScreenerInputEnvelope } from "../inputs/Project_coaching_screeningCreateManyScreenerInputEnvelope";
import { Project_coaching_screeningCreateOrConnectWithoutScreenerInput } from "../inputs/Project_coaching_screeningCreateOrConnectWithoutScreenerInput";
import { Project_coaching_screeningCreateWithoutScreenerInput } from "../inputs/Project_coaching_screeningCreateWithoutScreenerInput";
import { Project_coaching_screeningWhereUniqueInput } from "../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.InputType("Project_coaching_screeningCreateNestedManyWithoutScreenerInput", {
  isAbstract: true
})
export class Project_coaching_screeningCreateNestedManyWithoutScreenerInput {
  @TypeGraphQL.Field(_type => [Project_coaching_screeningCreateWithoutScreenerInput], {
    nullable: true
  })
  create?: Project_coaching_screeningCreateWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningCreateOrConnectWithoutScreenerInput], {
    nullable: true
  })
  connectOrCreate?: Project_coaching_screeningCreateOrConnectWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateManyScreenerInputEnvelope, {
    nullable: true
  })
  createMany?: Project_coaching_screeningCreateManyScreenerInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningWhereUniqueInput], {
    nullable: true
  })
  connect?: Project_coaching_screeningWhereUniqueInput[] | undefined;
}
