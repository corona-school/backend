import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutLectureInput } from "../inputs/StudentCreateOrConnectWithoutLectureInput";
import { StudentCreateWithoutLectureInput } from "../inputs/StudentCreateWithoutLectureInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateNestedOneWithoutLectureInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutLectureInput, {
    nullable: true
  })
  create?: StudentCreateWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutLectureInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
