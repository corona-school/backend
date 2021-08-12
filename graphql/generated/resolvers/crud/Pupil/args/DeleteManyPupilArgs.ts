import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilWhereInput } from "../../../inputs/PupilWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyPupilArgs {
  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  where?: PupilWhereInput | undefined;
}
