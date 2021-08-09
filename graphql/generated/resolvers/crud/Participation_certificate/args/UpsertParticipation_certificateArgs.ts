import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Participation_certificateCreateInput } from "../../../inputs/Participation_certificateCreateInput";
import { Participation_certificateUpdateInput } from "../../../inputs/Participation_certificateUpdateInput";
import { Participation_certificateWhereUniqueInput } from "../../../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertParticipation_certificateArgs {
  @TypeGraphQL.Field(_type => Participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Participation_certificateWhereUniqueInput;

  @TypeGraphQL.Field(_type => Participation_certificateCreateInput, {
    nullable: false
  })
  create!: Participation_certificateCreateInput;

  @TypeGraphQL.Field(_type => Participation_certificateUpdateInput, {
    nullable: false
  })
  update!: Participation_certificateUpdateInput;
}
