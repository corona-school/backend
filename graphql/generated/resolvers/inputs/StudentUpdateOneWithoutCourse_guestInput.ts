import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutCourse_guestInput } from "../inputs/StudentCreateOrConnectWithoutCourse_guestInput";
import { StudentCreateWithoutCourse_guestInput } from "../inputs/StudentCreateWithoutCourse_guestInput";
import { StudentUpdateWithoutCourse_guestInput } from "../inputs/StudentUpdateWithoutCourse_guestInput";
import { StudentUpsertWithoutCourse_guestInput } from "../inputs/StudentUpsertWithoutCourse_guestInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpdateOneWithoutCourse_guestInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_guestInput, {
    nullable: true
  })
  create?: StudentCreateWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutCourse_guestInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutCourse_guestInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateWithoutCourse_guestInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutCourse_guestInput | undefined;
}
