import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LectureUpdateManyMutationInput } from "../../../inputs/LectureUpdateManyMutationInput";
import { LectureWhereInput } from "../../../inputs/LectureWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyLectureArgs {
  @TypeGraphQL.Field(_type => LectureUpdateManyMutationInput, {
    nullable: false
  })
  data!: LectureUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => LectureWhereInput, {
    nullable: true
  })
  where?: LectureWhereInput | undefined;
}
