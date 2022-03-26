import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilCreateWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilCreateWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.InputType("Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput", {
  isAbstract: true
})
export class Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_waiting_list_pupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCreateWithoutSubcourseInput, {
    nullable: false
  })
  create!: Subcourse_waiting_list_pupilCreateWithoutSubcourseInput;
}
