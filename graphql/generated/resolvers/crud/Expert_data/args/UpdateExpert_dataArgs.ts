import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataUpdateInput } from "../../../inputs/Expert_dataUpdateInput";
import { Expert_dataWhereUniqueInput } from "../../../inputs/Expert_dataWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateExpert_dataArgs {
  @TypeGraphQL.Field(_type => Expert_dataUpdateInput, {
    nullable: false
  })
  data!: Expert_dataUpdateInput;

  @TypeGraphQL.Field(_type => Expert_dataWhereUniqueInput, {
    nullable: false
  })
  where!: Expert_dataWhereUniqueInput;
}
