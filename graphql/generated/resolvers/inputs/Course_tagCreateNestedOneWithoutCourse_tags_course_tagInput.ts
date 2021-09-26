import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tagCreateOrConnectWithoutCourse_tags_course_tagInput } from "../inputs/Course_tagCreateOrConnectWithoutCourse_tags_course_tagInput";
import { Course_tagCreateWithoutCourse_tags_course_tagInput } from "../inputs/Course_tagCreateWithoutCourse_tags_course_tagInput";
import { Course_tagWhereUniqueInput } from "../inputs/Course_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tagCreateNestedOneWithoutCourse_tags_course_tagInput {
  @TypeGraphQL.Field(_type => Course_tagCreateWithoutCourse_tags_course_tagInput, {
    nullable: true
  })
  create?: Course_tagCreateWithoutCourse_tags_course_tagInput | undefined;

  @TypeGraphQL.Field(_type => Course_tagCreateOrConnectWithoutCourse_tags_course_tagInput, {
    nullable: true
  })
  connectOrCreate?: Course_tagCreateOrConnectWithoutCourse_tags_course_tagInput | undefined;

  @TypeGraphQL.Field(_type => Course_tagWhereUniqueInput, {
    nullable: true
  })
  connect?: Course_tagWhereUniqueInput | undefined;
}
