import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateOrConnectWithoutCourse_guestInput } from "../inputs/CourseCreateOrConnectWithoutCourse_guestInput";
import { CourseCreateWithoutCourse_guestInput } from "../inputs/CourseCreateWithoutCourse_guestInput";
import { CourseUpdateWithoutCourse_guestInput } from "../inputs/CourseUpdateWithoutCourse_guestInput";
import { CourseUpsertWithoutCourse_guestInput } from "../inputs/CourseUpsertWithoutCourse_guestInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseUpdateOneWithoutCourse_guestInput {
  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_guestInput, {
    nullable: true
  })
  create?: CourseCreateWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => CourseCreateOrConnectWithoutCourse_guestInput, {
    nullable: true
  })
  connectOrCreate?: CourseCreateOrConnectWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => CourseUpsertWithoutCourse_guestInput, {
    nullable: true
  })
  upsert?: CourseUpsertWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: true
  })
  connect?: CourseWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => CourseUpdateWithoutCourse_guestInput, {
    nullable: true
  })
  update?: CourseUpdateWithoutCourse_guestInput | undefined;
}
