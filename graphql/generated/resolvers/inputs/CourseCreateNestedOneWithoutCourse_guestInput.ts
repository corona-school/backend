import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateOrConnectWithoutCourse_guestInput } from "../inputs/CourseCreateOrConnectWithoutCourse_guestInput";
import { CourseCreateWithoutCourse_guestInput } from "../inputs/CourseCreateWithoutCourse_guestInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseCreateNestedOneWithoutCourse_guestInput {
  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_guestInput, {
    nullable: true
  })
  create?: CourseCreateWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => CourseCreateOrConnectWithoutCourse_guestInput, {
    nullable: true
  })
  connectOrCreate?: CourseCreateOrConnectWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: true
  })
  connect?: CourseWhereUniqueInput | undefined;
}
