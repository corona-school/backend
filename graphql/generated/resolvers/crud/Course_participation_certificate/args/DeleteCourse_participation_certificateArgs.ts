import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateWhereUniqueInput } from "../../../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Course_participation_certificateWhereUniqueInput;
}
