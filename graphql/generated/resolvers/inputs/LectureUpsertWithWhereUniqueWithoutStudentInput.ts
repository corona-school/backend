import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateWithoutStudentInput } from "../inputs/LectureCreateWithoutStudentInput";
import { LectureUpdateWithoutStudentInput } from "../inputs/LectureUpdateWithoutStudentInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureUpsertWithWhereUniqueWithoutStudentInput {
  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: false
  })
  where!: LectureWhereUniqueInput;

  @TypeGraphQL.Field(_type => LectureUpdateWithoutStudentInput, {
    nullable: false
  })
  update!: LectureUpdateWithoutStudentInput;

  @TypeGraphQL.Field(_type => LectureCreateWithoutStudentInput, {
    nullable: false
  })
  create!: LectureCreateWithoutStudentInput;
}
