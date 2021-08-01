import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateUpdateInput } from "../../../inputs/Course_participation_certificateUpdateInput";
import { Course_participation_certificateWhereUniqueInput } from "../../../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => Course_participation_certificateUpdateInput, {
    nullable: false
  })
  data!: Course_participation_certificateUpdateInput;

  @TypeGraphQL.Field(_type => Course_participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Course_participation_certificateWhereUniqueInput;
}
