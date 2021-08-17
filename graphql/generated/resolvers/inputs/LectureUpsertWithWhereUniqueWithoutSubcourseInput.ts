import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateWithoutSubcourseInput } from "../inputs/LectureCreateWithoutSubcourseInput";
import { LectureUpdateWithoutSubcourseInput } from "../inputs/LectureUpdateWithoutSubcourseInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureUpsertWithWhereUniqueWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: false
  })
  where!: LectureWhereUniqueInput;

  @TypeGraphQL.Field(_type => LectureUpdateWithoutSubcourseInput, {
    nullable: false
  })
  update!: LectureUpdateWithoutSubcourseInput;

  @TypeGraphQL.Field(_type => LectureCreateWithoutSubcourseInput, {
    nullable: false
  })
  create!: LectureCreateWithoutSubcourseInput;
}
