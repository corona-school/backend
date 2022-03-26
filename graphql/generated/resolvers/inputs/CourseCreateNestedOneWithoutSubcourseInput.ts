import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateOrConnectWithoutSubcourseInput } from "../inputs/CourseCreateOrConnectWithoutSubcourseInput";
import { CourseCreateWithoutSubcourseInput } from "../inputs/CourseCreateWithoutSubcourseInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType("CourseCreateNestedOneWithoutSubcourseInput", {
  isAbstract: true
})
export class CourseCreateNestedOneWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => CourseCreateWithoutSubcourseInput, {
    nullable: true
  })
  create?: CourseCreateWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => CourseCreateOrConnectWithoutSubcourseInput, {
    nullable: true
  })
  connectOrCreate?: CourseCreateOrConnectWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: true
  })
  connect?: CourseWhereUniqueInput | undefined;
}
