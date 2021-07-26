import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateOrConnectWithoutSubcourseInput } from "../inputs/CourseCreateOrConnectWithoutSubcourseInput";
import { CourseCreateWithoutSubcourseInput } from "../inputs/CourseCreateWithoutSubcourseInput";
import { CourseUpdateWithoutSubcourseInput } from "../inputs/CourseUpdateWithoutSubcourseInput";
import { CourseUpsertWithoutSubcourseInput } from "../inputs/CourseUpsertWithoutSubcourseInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseUpdateOneWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => CourseCreateWithoutSubcourseInput, {
    nullable: true
  })
  create?: CourseCreateWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => CourseCreateOrConnectWithoutSubcourseInput, {
    nullable: true
  })
  connectOrCreate?: CourseCreateOrConnectWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => CourseUpsertWithoutSubcourseInput, {
    nullable: true
  })
  upsert?: CourseUpsertWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: true
  })
  connect?: CourseWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => CourseUpdateWithoutSubcourseInput, {
    nullable: true
  })
  update?: CourseUpdateWithoutSubcourseInput | undefined;
}
