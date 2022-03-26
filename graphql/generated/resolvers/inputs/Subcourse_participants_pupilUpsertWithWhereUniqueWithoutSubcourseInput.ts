import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilCreateWithoutSubcourseInput } from "../inputs/Subcourse_participants_pupilCreateWithoutSubcourseInput";
import { Subcourse_participants_pupilUpdateWithoutSubcourseInput } from "../inputs/Subcourse_participants_pupilUpdateWithoutSubcourseInput";
import { Subcourse_participants_pupilWhereUniqueInput } from "../inputs/Subcourse_participants_pupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_participants_pupilUpsertWithWhereUniqueWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_participants_pupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilUpdateWithoutSubcourseInput, {
    nullable: false
  })
  update!: Subcourse_participants_pupilUpdateWithoutSubcourseInput;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilCreateWithoutSubcourseInput, {
    nullable: false
  })
  create!: Subcourse_participants_pupilCreateWithoutSubcourseInput;
}
