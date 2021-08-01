import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateWhereInput } from "../../../inputs/Course_participation_certificateWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereInput, {
    nullable: true
  })
  where?: Course_participation_certificateWhereInput | undefined;
}
