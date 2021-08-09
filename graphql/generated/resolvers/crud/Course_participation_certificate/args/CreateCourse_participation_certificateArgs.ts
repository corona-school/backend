import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateCreateInput } from "../../../inputs/Course_participation_certificateCreateInput";

@TypeGraphQL.ArgsType()
export class CreateCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => Course_participation_certificateCreateInput, {
    nullable: false
  })
  data!: Course_participation_certificateCreateInput;
}
