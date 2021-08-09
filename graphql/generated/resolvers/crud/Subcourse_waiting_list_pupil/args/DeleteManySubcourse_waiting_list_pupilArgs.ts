import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_waiting_list_pupilWhereInput } from "../../../inputs/Subcourse_waiting_list_pupilWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManySubcourse_waiting_list_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereInput, {
    nullable: true
  })
  where?: Subcourse_waiting_list_pupilWhereInput | undefined;
}
