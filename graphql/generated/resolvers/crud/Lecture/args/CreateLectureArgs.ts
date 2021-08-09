import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LectureCreateInput } from "../../../inputs/LectureCreateInput";

@TypeGraphQL.ArgsType()
export class CreateLectureArgs {
  @TypeGraphQL.Field(_type => LectureCreateInput, {
    nullable: false
  })
  data!: LectureCreateInput;
}
