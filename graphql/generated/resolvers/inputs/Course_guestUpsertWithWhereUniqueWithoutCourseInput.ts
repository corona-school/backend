import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestCreateWithoutCourseInput } from "../inputs/Course_guestCreateWithoutCourseInput";
import { Course_guestUpdateWithoutCourseInput } from "../inputs/Course_guestUpdateWithoutCourseInput";
import { Course_guestWhereUniqueInput } from "../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_guestUpsertWithWhereUniqueWithoutCourseInput {
  @TypeGraphQL.Field(_type => Course_guestWhereUniqueInput, {
    nullable: false
  })
  where!: Course_guestWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_guestUpdateWithoutCourseInput, {
    nullable: false
  })
  update!: Course_guestUpdateWithoutCourseInput;

  @TypeGraphQL.Field(_type => Course_guestCreateWithoutCourseInput, {
    nullable: false
  })
  create!: Course_guestCreateWithoutCourseInput;
}
