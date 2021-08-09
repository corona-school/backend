import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Participation_certificateUpdateManyMutationInput } from "../../../inputs/Participation_certificateUpdateManyMutationInput";
import { Participation_certificateWhereInput } from "../../../inputs/Participation_certificateWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyParticipation_certificateArgs {
  @TypeGraphQL.Field(_type => Participation_certificateUpdateManyMutationInput, {
    nullable: false
  })
  data!: Participation_certificateUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Participation_certificateWhereInput, {
    nullable: true
  })
  where?: Participation_certificateWhereInput | undefined;
}
