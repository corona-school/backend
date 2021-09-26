import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Participation_certificateCreateInput } from "../../../inputs/Participation_certificateCreateInput";

@TypeGraphQL.ArgsType()
export class CreateParticipation_certificateArgs {
  @TypeGraphQL.Field(_type => Participation_certificateCreateInput, {
    nullable: false
  })
  data!: Participation_certificateCreateInput;
}
