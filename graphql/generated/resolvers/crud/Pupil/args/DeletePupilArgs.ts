import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilWhereUniqueInput } from "../../../inputs/PupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeletePupilArgs {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;
}
