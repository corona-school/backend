import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilUpdateWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilUpdateWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.InputType("Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutSubcourseInput", {
  isAbstract: true
})
export class Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_waiting_list_pupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilUpdateWithoutSubcourseInput, {
    nullable: false
  })
  data!: Subcourse_waiting_list_pupilUpdateWithoutSubcourseInput;
}
