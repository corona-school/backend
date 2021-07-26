import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_waiting_list_pupilUpdateInput } from "../../../inputs/Subcourse_waiting_list_pupilUpdateInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../../../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateSubcourse_waiting_list_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilUpdateInput, {
    nullable: false
  })
  data!: Subcourse_waiting_list_pupilUpdateInput;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_waiting_list_pupilWhereUniqueInput;
}
