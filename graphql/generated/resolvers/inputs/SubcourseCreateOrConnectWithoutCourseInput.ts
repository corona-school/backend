import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutCourseInput } from "../inputs/SubcourseCreateWithoutCourseInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseCreateOrConnectWithoutCourseInput {
  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: false
  })
  where!: SubcourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutCourseInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutCourseInput;
}
