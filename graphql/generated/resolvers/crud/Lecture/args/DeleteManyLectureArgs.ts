import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LectureWhereInput } from "../../../inputs/LectureWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyLectureArgs {
  @TypeGraphQL.Field(_type => LectureWhereInput, {
    nullable: true
  })
  where?: LectureWhereInput | undefined;
}
