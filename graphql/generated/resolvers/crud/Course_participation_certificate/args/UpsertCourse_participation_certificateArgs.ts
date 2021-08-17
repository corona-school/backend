import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateCreateInput } from "../../../inputs/Course_participation_certificateCreateInput";
import { Course_participation_certificateUpdateInput } from "../../../inputs/Course_participation_certificateUpdateInput";
import { Course_participation_certificateWhereUniqueInput } from "../../../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Course_participation_certificateWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_participation_certificateCreateInput, {
    nullable: false
  })
  create!: Course_participation_certificateCreateInput;

  @TypeGraphQL.Field(_type => Course_participation_certificateUpdateInput, {
    nullable: false
  })
  update!: Course_participation_certificateUpdateInput;
}
