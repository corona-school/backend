import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseUpdateWithoutCourseInput } from "../inputs/SubcourseUpdateWithoutCourseInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType("SubcourseUpdateWithWhereUniqueWithoutCourseInput", {
  isAbstract: true
})
export class SubcourseUpdateWithWhereUniqueWithoutCourseInput {
  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: false
  })
  where!: SubcourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => SubcourseUpdateWithoutCourseInput, {
    nullable: false
  })
  data!: SubcourseUpdateWithoutCourseInput;
}
