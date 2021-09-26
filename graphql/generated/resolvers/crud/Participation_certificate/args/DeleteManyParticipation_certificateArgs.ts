import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Participation_certificateWhereInput } from "../../../inputs/Participation_certificateWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyParticipation_certificateArgs {
  @TypeGraphQL.Field(_type => Participation_certificateWhereInput, {
    nullable: true
  })
  where?: Participation_certificateWhereInput | undefined;
}
