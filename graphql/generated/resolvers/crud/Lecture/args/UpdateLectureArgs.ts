import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LectureUpdateInput } from "../../../inputs/LectureUpdateInput";
import { LectureWhereUniqueInput } from "../../../inputs/LectureWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateLectureArgs {
  @TypeGraphQL.Field(_type => LectureUpdateInput, {
    nullable: false
  })
  data!: LectureUpdateInput;

  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: false
  })
  where!: LectureWhereUniqueInput;
}
