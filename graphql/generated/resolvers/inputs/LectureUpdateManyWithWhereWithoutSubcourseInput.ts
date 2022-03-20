import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureScalarWhereInput } from "../inputs/LectureScalarWhereInput";
import { LectureUpdateManyMutationInput } from "../inputs/LectureUpdateManyMutationInput";

@TypeGraphQL.InputType("LectureUpdateManyWithWhereWithoutSubcourseInput", {
  isAbstract: true
})
export class LectureUpdateManyWithWhereWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => LectureScalarWhereInput, {
    nullable: false
  })
  where!: LectureScalarWhereInput;

  @TypeGraphQL.Field(_type => LectureUpdateManyMutationInput, {
    nullable: false
  })
  data!: LectureUpdateManyMutationInput;
}
