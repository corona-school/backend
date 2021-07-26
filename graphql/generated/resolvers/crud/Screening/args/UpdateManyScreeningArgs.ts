import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreeningUpdateManyMutationInput } from "../../../inputs/ScreeningUpdateManyMutationInput";
import { ScreeningWhereInput } from "../../../inputs/ScreeningWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyScreeningArgs {
  @TypeGraphQL.Field(_type => ScreeningUpdateManyMutationInput, {
    nullable: false
  })
  data!: ScreeningUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => ScreeningWhereInput, {
    nullable: true
  })
  where?: ScreeningWhereInput | undefined;
}
