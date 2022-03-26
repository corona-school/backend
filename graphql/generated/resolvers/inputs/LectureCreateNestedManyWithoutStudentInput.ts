import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateManyStudentInputEnvelope } from "../inputs/LectureCreateManyStudentInputEnvelope";
import { LectureCreateOrConnectWithoutStudentInput } from "../inputs/LectureCreateOrConnectWithoutStudentInput";
import { LectureCreateWithoutStudentInput } from "../inputs/LectureCreateWithoutStudentInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureCreateNestedManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [LectureCreateWithoutStudentInput], {
    nullable: true
  })
  create?: LectureCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: LectureCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => LectureCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: LectureCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [LectureWhereUniqueInput], {
    nullable: true
  })
  connect?: LectureWhereUniqueInput[] | undefined;
}
