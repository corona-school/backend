import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_participants_pupilWhereInput } from "../../../inputs/Subcourse_participants_pupilWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManySubcourse_participants_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereInput, {
    nullable: true
  })
  where?: Subcourse_participants_pupilWhereInput | undefined;
}
