import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_waiting_list_pupilCreateInput } from "../../../inputs/Subcourse_waiting_list_pupilCreateInput";

@TypeGraphQL.ArgsType()
export class CreateSubcourse_waiting_list_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCreateInput, {
    nullable: false
  })
  data!: Subcourse_waiting_list_pupilCreateInput;
}
