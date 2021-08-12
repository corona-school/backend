import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Participation_certificateWhereUniqueInput } from "../../../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueParticipation_certificateArgs {
  @TypeGraphQL.Field(_type => Participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Participation_certificateWhereUniqueInput;
}
