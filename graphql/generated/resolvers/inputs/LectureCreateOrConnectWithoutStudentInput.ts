import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateWithoutStudentInput } from "../inputs/LectureCreateWithoutStudentInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType("LectureCreateOrConnectWithoutStudentInput", {
  isAbstract: true
})
export class LectureCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: false
  })
  where!: LectureWhereUniqueInput;

  @TypeGraphQL.Field(_type => LectureCreateWithoutStudentInput, {
    nullable: false
  })
  create!: LectureCreateWithoutStudentInput;
}
