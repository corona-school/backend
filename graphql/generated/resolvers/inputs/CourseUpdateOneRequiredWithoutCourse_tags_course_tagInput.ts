import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateOrConnectWithoutCourse_tags_course_tagInput } from "../inputs/CourseCreateOrConnectWithoutCourse_tags_course_tagInput";
import { CourseCreateWithoutCourse_tags_course_tagInput } from "../inputs/CourseCreateWithoutCourse_tags_course_tagInput";
import { CourseUpdateWithoutCourse_tags_course_tagInput } from "../inputs/CourseUpdateWithoutCourse_tags_course_tagInput";
import { CourseUpsertWithoutCourse_tags_course_tagInput } from "../inputs/CourseUpsertWithoutCourse_tags_course_tagInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType("CourseUpdateOneRequiredWithoutCourse_tags_course_tagInput", {
  isAbstract: true
})
export class CourseUpdateOneRequiredWithoutCourse_tags_course_tagInput {
  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_tags_course_tagInput, {
    nullable: true
  })
  create?: CourseCreateWithoutCourse_tags_course_tagInput | undefined;

  @TypeGraphQL.Field(_type => CourseCreateOrConnectWithoutCourse_tags_course_tagInput, {
    nullable: true
  })
  connectOrCreate?: CourseCreateOrConnectWithoutCourse_tags_course_tagInput | undefined;

  @TypeGraphQL.Field(_type => CourseUpsertWithoutCourse_tags_course_tagInput, {
    nullable: true
  })
  upsert?: CourseUpsertWithoutCourse_tags_course_tagInput | undefined;

  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: true
  })
  connect?: CourseWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => CourseUpdateWithoutCourse_tags_course_tagInput, {
    nullable: true
  })
  update?: CourseUpdateWithoutCourse_tags_course_tagInput | undefined;
}
