import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateOrConnectWithoutCourse_instructors_studentInput } from "../inputs/CourseCreateOrConnectWithoutCourse_instructors_studentInput";
import { CourseCreateWithoutCourse_instructors_studentInput } from "../inputs/CourseCreateWithoutCourse_instructors_studentInput";
import { CourseUpdateWithoutCourse_instructors_studentInput } from "../inputs/CourseUpdateWithoutCourse_instructors_studentInput";
import { CourseUpsertWithoutCourse_instructors_studentInput } from "../inputs/CourseUpsertWithoutCourse_instructors_studentInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType("CourseUpdateOneRequiredWithoutCourse_instructors_studentInput", {
  isAbstract: true
})
export class CourseUpdateOneRequiredWithoutCourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_instructors_studentInput, {
    nullable: true
  })
  create?: CourseCreateWithoutCourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => CourseCreateOrConnectWithoutCourse_instructors_studentInput, {
    nullable: true
  })
  connectOrCreate?: CourseCreateOrConnectWithoutCourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => CourseUpsertWithoutCourse_instructors_studentInput, {
    nullable: true
  })
  upsert?: CourseUpsertWithoutCourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: true
  })
  connect?: CourseWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => CourseUpdateWithoutCourse_instructors_studentInput, {
    nullable: true
  })
  update?: CourseUpdateWithoutCourse_instructors_studentInput | undefined;
}
