import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LectureCreateInput } from "../../../inputs/LectureCreateInput";
import { LectureUpdateInput } from "../../../inputs/LectureUpdateInput";
import { LectureWhereUniqueInput } from "../../../inputs/LectureWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertLectureArgs {
  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: false
  })
  where!: LectureWhereUniqueInput;

  @TypeGraphQL.Field(_type => LectureCreateInput, {
    nullable: false
  })
  create!: LectureCreateInput;

  @TypeGraphQL.Field(_type => LectureUpdateInput, {
    nullable: false
  })
  update!: LectureUpdateInput;
}
