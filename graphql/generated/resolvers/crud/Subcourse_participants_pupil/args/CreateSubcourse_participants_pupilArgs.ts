import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_participants_pupilCreateInput } from "../../../inputs/Subcourse_participants_pupilCreateInput";

@TypeGraphQL.ArgsType()
export class CreateSubcourse_participants_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilCreateInput, {
    nullable: false
  })
  data!: Subcourse_participants_pupilCreateInput;
}
