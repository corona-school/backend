import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../../../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteSubcourse_waiting_list_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_waiting_list_pupilWhereUniqueInput;
}
