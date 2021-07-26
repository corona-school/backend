import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataUpdateManyMutationInput } from "../../../inputs/Expert_dataUpdateManyMutationInput";
import { Expert_dataWhereInput } from "../../../inputs/Expert_dataWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyExpert_dataArgs {
  @TypeGraphQL.Field(_type => Expert_dataUpdateManyMutationInput, {
    nullable: false
  })
  data!: Expert_dataUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Expert_dataWhereInput, {
    nullable: true
  })
  where?: Expert_dataWhereInput | undefined;
}
