import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningScalarWhereInput } from "../inputs/ScreeningScalarWhereInput";
import { ScreeningUpdateManyMutationInput } from "../inputs/ScreeningUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreeningUpdateManyWithWhereWithoutScreenerInput {
  @TypeGraphQL.Field(_type => ScreeningScalarWhereInput, {
    nullable: false
  })
  where!: ScreeningScalarWhereInput;

  @TypeGraphQL.Field(_type => ScreeningUpdateManyMutationInput, {
    nullable: false
  })
  data!: ScreeningUpdateManyMutationInput;
}
