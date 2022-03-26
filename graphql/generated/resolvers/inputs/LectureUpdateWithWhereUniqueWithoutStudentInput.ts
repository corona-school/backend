import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureUpdateWithoutStudentInput } from "../inputs/LectureUpdateWithoutStudentInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureUpdateWithWhereUniqueWithoutStudentInput {
  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: false
  })
  where!: LectureWhereUniqueInput;

  @TypeGraphQL.Field(_type => LectureUpdateWithoutStudentInput, {
    nullable: false
  })
  data!: LectureUpdateWithoutStudentInput;
}
