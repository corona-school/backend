import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateUpdateManyMutationInput } from "../../../inputs/Course_participation_certificateUpdateManyMutationInput";
import { Course_participation_certificateWhereInput } from "../../../inputs/Course_participation_certificateWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => Course_participation_certificateUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_participation_certificateUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Course_participation_certificateWhereInput, {
    nullable: true
  })
  where?: Course_participation_certificateWhereInput | undefined;
}
