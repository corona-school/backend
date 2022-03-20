import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateWithoutSubcourseInput } from "../inputs/Course_participation_certificateCreateWithoutSubcourseInput";
import { Course_participation_certificateUpdateWithoutSubcourseInput } from "../inputs/Course_participation_certificateUpdateWithoutSubcourseInput";
import { Course_participation_certificateWhereUniqueInput } from "../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Course_participation_certificateUpsertWithWhereUniqueWithoutSubcourseInput", {
  isAbstract: true
})
export class Course_participation_certificateUpsertWithWhereUniqueWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Course_participation_certificateWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_participation_certificateUpdateWithoutSubcourseInput, {
    nullable: false
  })
  update!: Course_participation_certificateUpdateWithoutSubcourseInput;

  @TypeGraphQL.Field(_type => Course_participation_certificateCreateWithoutSubcourseInput, {
    nullable: false
  })
  create!: Course_participation_certificateCreateWithoutSubcourseInput;
}
