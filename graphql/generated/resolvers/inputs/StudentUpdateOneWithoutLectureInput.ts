import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutLectureInput } from "../inputs/StudentCreateOrConnectWithoutLectureInput";
import { StudentCreateWithoutLectureInput } from "../inputs/StudentCreateWithoutLectureInput";
import { StudentUpdateWithoutLectureInput } from "../inputs/StudentUpdateWithoutLectureInput";
import { StudentUpsertWithoutLectureInput } from "../inputs/StudentUpsertWithoutLectureInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentUpdateOneWithoutLectureInput", {
  isAbstract: true
})
export class StudentUpdateOneWithoutLectureInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutLectureInput, {
    nullable: true
  })
  create?: StudentCreateWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutLectureInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutLectureInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateWithoutLectureInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutLectureInput | undefined;
}
