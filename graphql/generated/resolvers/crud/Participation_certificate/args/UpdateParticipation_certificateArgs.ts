import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Participation_certificateUpdateInput } from "../../../inputs/Participation_certificateUpdateInput";
import { Participation_certificateWhereUniqueInput } from "../../../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateParticipation_certificateArgs {
  @TypeGraphQL.Field(_type => Participation_certificateUpdateInput, {
    nullable: false
  })
  data!: Participation_certificateUpdateInput;

  @TypeGraphQL.Field(_type => Participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Participation_certificateWhereUniqueInput;
}
