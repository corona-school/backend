import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagCreateManyCourse_tagInputEnvelope } from "../inputs/Course_tags_course_tagCreateManyCourse_tagInputEnvelope";
import { Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput";
import { Course_tags_course_tagCreateWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagCreateWithoutCourse_tagInput";
import { Course_tags_course_tagWhereUniqueInput } from "../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.InputType("Course_tags_course_tagCreateNestedManyWithoutCourse_tagInput", {
  isAbstract: true
})
export class Course_tags_course_tagCreateNestedManyWithoutCourse_tagInput {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateWithoutCourse_tagInput], {
    nullable: true
  })
  create?: Course_tags_course_tagCreateWithoutCourse_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput], {
    nullable: true
  })
  connectOrCreate?: Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateManyCourse_tagInputEnvelope, {
    nullable: true
  })
  createMany?: Course_tags_course_tagCreateManyCourse_tagInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_tags_course_tagWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_tags_course_tagWhereUniqueInput[] | undefined;
}
