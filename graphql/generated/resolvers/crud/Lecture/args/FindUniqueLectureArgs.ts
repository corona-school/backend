import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LectureWhereUniqueInput } from "../../../inputs/LectureWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueLectureArgs {
  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: false
  })
  where!: LectureWhereUniqueInput;
}
