import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilCreateInput } from "../../../inputs/PupilCreateInput";

@TypeGraphQL.ArgsType()
export class CreatePupilArgs {
  @TypeGraphQL.Field(_type => PupilCreateInput, {
    nullable: false
  })
  data!: PupilCreateInput;
}
