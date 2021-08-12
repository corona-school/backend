import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Participation_certificateCreateManyInput } from "../../../inputs/Participation_certificateCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyParticipation_certificateArgs {
  @TypeGraphQL.Field(_type => [Participation_certificateCreateManyInput], {
    nullable: false
  })
  data!: Participation_certificateCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
