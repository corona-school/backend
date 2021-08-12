import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_waiting_list_pupilCreateInput } from "../../../inputs/Subcourse_waiting_list_pupilCreateInput";
import { Subcourse_waiting_list_pupilUpdateInput } from "../../../inputs/Subcourse_waiting_list_pupilUpdateInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../../../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertSubcourse_waiting_list_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_waiting_list_pupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCreateInput, {
    nullable: false
  })
  create!: Subcourse_waiting_list_pupilCreateInput;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilUpdateInput, {
    nullable: false
  })
  update!: Subcourse_waiting_list_pupilUpdateInput;
}
