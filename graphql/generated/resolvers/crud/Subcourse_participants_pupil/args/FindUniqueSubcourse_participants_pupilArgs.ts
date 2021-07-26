import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_participants_pupilWhereUniqueInput } from "../../../inputs/Subcourse_participants_pupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueSubcourse_participants_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_participants_pupilWhereUniqueInput;
}
