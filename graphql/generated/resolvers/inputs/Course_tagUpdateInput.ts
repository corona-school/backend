import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagUpdateManyWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagUpdateManyWithoutCourse_tagInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";

@TypeGraphQL.InputType("Course_tagUpdateInput", {
  isAbstract: true
})
export class Course_tagUpdateInput {
  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  identifier?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  name?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  category?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagUpdateManyWithoutCourse_tagInput, {
    nullable: true
  })
  course_tags_course_tag?: Course_tags_course_tagUpdateManyWithoutCourse_tagInput | undefined;
}
