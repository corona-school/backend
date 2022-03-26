import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagCreateManyCourseInputEnvelope } from "../inputs/Course_tags_course_tagCreateManyCourseInputEnvelope";
import { Course_tags_course_tagCreateOrConnectWithoutCourseInput } from "../inputs/Course_tags_course_tagCreateOrConnectWithoutCourseInput";
import { Course_tags_course_tagCreateWithoutCourseInput } from "../inputs/Course_tags_course_tagCreateWithoutCourseInput";
import { Course_tags_course_tagWhereUniqueInput } from "../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagCreateNestedManyWithoutCourseInput {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateWithoutCourseInput], {
    nullable: true
  })
  create?: Course_tags_course_tagCreateWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateOrConnectWithoutCourseInput], {
    nullable: true
  })
  connectOrCreate?: Course_tags_course_tagCreateOrConnectWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateManyCourseInputEnvelope, {
    nullable: true
  })
  createMany?: Course_tags_course_tagCreateManyCourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_tags_course_tagWhereUniqueInput[] | undefined;
}
