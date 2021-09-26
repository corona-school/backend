import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataCreateInput } from "../../../inputs/Expert_dataCreateInput";
import { Expert_dataUpdateInput } from "../../../inputs/Expert_dataUpdateInput";
import { Expert_dataWhereUniqueInput } from "../../../inputs/Expert_dataWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertExpert_dataArgs {
  @TypeGraphQL.Field(_type => Expert_dataWhereUniqueInput, {
    nullable: false
  })
  where!: Expert_dataWhereUniqueInput;

  @TypeGraphQL.Field(_type => Expert_dataCreateInput, {
    nullable: false
  })
  create!: Expert_dataCreateInput;

  @TypeGraphQL.Field(_type => Expert_dataUpdateInput, {
    nullable: false
  })
  update!: Expert_dataUpdateInput;
}
