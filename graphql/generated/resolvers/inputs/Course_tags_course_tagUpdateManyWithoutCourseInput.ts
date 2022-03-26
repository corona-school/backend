import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagCreateManyCourseInputEnvelope } from "../inputs/Course_tags_course_tagCreateManyCourseInputEnvelope";
import { Course_tags_course_tagCreateOrConnectWithoutCourseInput } from "../inputs/Course_tags_course_tagCreateOrConnectWithoutCourseInput";
import { Course_tags_course_tagCreateWithoutCourseInput } from "../inputs/Course_tags_course_tagCreateWithoutCourseInput";
import { Course_tags_course_tagScalarWhereInput } from "../inputs/Course_tags_course_tagScalarWhereInput";
import { Course_tags_course_tagUpdateManyWithWhereWithoutCourseInput } from "../inputs/Course_tags_course_tagUpdateManyWithWhereWithoutCourseInput";
import { Course_tags_course_tagUpdateWithWhereUniqueWithoutCourseInput } from "../inputs/Course_tags_course_tagUpdateWithWhereUniqueWithoutCourseInput";
import { Course_tags_course_tagUpsertWithWhereUniqueWithoutCourseInput } from "../inputs/Course_tags_course_tagUpsertWithWhereUniqueWithoutCourseInput";
import { Course_tags_course_tagWhereUniqueInput } from "../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.InputType("Course_tags_course_tagUpdateManyWithoutCourseInput", {
  isAbstract: true
})
export class Course_tags_course_tagUpdateManyWithoutCourseInput {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateWithoutCourseInput], {
    nullable: true
  })
  create?: Course_tags_course_tagCreateWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateOrConnectWithoutCourseInput], {
    nullable: true
  })
  connectOrCreate?: Course_tags_course_tagCreateOrConnectWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagUpsertWithWhereUniqueWithoutCourseInput], {
    nullable: true
  })
  upsert?: Course_tags_course_tagUpsertWithWhereUniqueWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateManyCourseInputEnvelope, {
    nullable: true
  })
  createMany?: Course_tags_course_tagCreateManyCourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereUniqueInput], {
    nullable: true
  })
  set?: Course_tags_course_tagWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Course_tags_course_tagWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereUniqueInput], {
    nullable: true
  })
  delete?: Course_tags_course_tagWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_tags_course_tagWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagUpdateWithWhereUniqueWithoutCourseInput], {
    nullable: true
  })
  update?: Course_tags_course_tagUpdateWithWhereUniqueWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagUpdateManyWithWhereWithoutCourseInput], {
    nullable: true
  })
  updateMany?: Course_tags_course_tagUpdateManyWithWhereWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_tags_course_tagScalarWhereInput[] | undefined;
}
