import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutCourseInput } from "../inputs/StudentCreateOrConnectWithoutCourseInput";
import { StudentCreateWithoutCourseInput } from "../inputs/StudentCreateWithoutCourseInput";
import { StudentUpdateWithoutCourseInput } from "../inputs/StudentUpdateWithoutCourseInput";
import { StudentUpsertWithoutCourseInput } from "../inputs/StudentUpsertWithoutCourseInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentUpdateOneWithoutCourseInput", {
  isAbstract: true
})
export class StudentUpdateOneWithoutCourseInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutCourseInput, {
    nullable: true
  })
  create?: StudentCreateWithoutCourseInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutCourseInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutCourseInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutCourseInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutCourseInput | undefined;

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

  @TypeGraphQL.Field(_type => StudentUpdateWithoutCourseInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutCourseInput | undefined;
}
