import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateWithoutCourse_guestInput } from "../inputs/CourseCreateWithoutCourse_guestInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType("CourseCreateOrConnectWithoutCourse_guestInput", {
  isAbstract: true
})
export class CourseCreateOrConnectWithoutCourse_guestInput {
  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: false
  })
  where!: CourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_guestInput, {
    nullable: false
  })
  create!: CourseCreateWithoutCourse_guestInput;
}
