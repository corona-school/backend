import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureUpdateWithoutSubcourseInput } from "../inputs/LectureUpdateWithoutSubcourseInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureUpdateWithWhereUniqueWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: false
  })
  where!: LectureWhereUniqueInput;

  @TypeGraphQL.Field(_type => LectureUpdateWithoutSubcourseInput, {
    nullable: false
  })
  data!: LectureUpdateWithoutSubcourseInput;
}
