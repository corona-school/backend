import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagCreateManyCourse_tagInputEnvelope } from "../inputs/Course_tags_course_tagCreateManyCourse_tagInputEnvelope";
import { Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput";
import { Course_tags_course_tagCreateWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagCreateWithoutCourse_tagInput";
import { Course_tags_course_tagScalarWhereInput } from "../inputs/Course_tags_course_tagScalarWhereInput";
import { Course_tags_course_tagUpdateManyWithWhereWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagUpdateManyWithWhereWithoutCourse_tagInput";
import { Course_tags_course_tagUpdateWithWhereUniqueWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagUpdateWithWhereUniqueWithoutCourse_tagInput";
import { Course_tags_course_tagUpsertWithWhereUniqueWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagUpsertWithWhereUniqueWithoutCourse_tagInput";
import { Course_tags_course_tagWhereUniqueInput } from "../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagUpdateManyWithoutCourse_tagInput {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateWithoutCourse_tagInput], {
    nullable: true
  })
  create?: Course_tags_course_tagCreateWithoutCourse_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput], {
    nullable: true
  })
  connectOrCreate?: Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagUpsertWithWhereUniqueWithoutCourse_tagInput], {
    nullable: true
  })
  upsert?: Course_tags_course_tagUpsertWithWhereUniqueWithoutCourse_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateManyCourse_tagInputEnvelope, {
    nullable: true
  })
  createMany?: Course_tags_course_tagCreateManyCourse_tagInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_tags_course_tagWhereUniqueInput[] | undefined;

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

  @TypeGraphQL.Field(_type => [Course_tags_course_tagUpdateWithWhereUniqueWithoutCourse_tagInput], {
    nullable: true
  })
  update?: Course_tags_course_tagUpdateWithWhereUniqueWithoutCourse_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagUpdateManyWithWhereWithoutCourse_tagInput], {
    nullable: true
  })
  updateMany?: Course_tags_course_tagUpdateManyWithWhereWithoutCourse_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_tags_course_tagScalarWhereInput[] | undefined;
}
