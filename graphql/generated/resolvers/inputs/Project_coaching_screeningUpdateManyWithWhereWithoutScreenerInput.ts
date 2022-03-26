import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningScalarWhereInput } from "../inputs/Project_coaching_screeningScalarWhereInput";
import { Project_coaching_screeningUpdateManyMutationInput } from "../inputs/Project_coaching_screeningUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_coaching_screeningUpdateManyWithWhereWithoutScreenerInput {
  @TypeGraphQL.Field(_type => Project_coaching_screeningScalarWhereInput, {
    nullable: false
  })
  where!: Project_coaching_screeningScalarWhereInput;

  @TypeGraphQL.Field(_type => Project_coaching_screeningUpdateManyMutationInput, {
    nullable: false
  })
  data!: Project_coaching_screeningUpdateManyMutationInput;
}
