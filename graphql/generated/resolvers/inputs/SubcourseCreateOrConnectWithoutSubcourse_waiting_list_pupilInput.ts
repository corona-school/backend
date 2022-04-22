import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/SubcourseCreateWithoutSubcourse_waiting_list_pupilInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType("SubcourseCreateOrConnectWithoutSubcourse_waiting_list_pupilInput", {
  isAbstract: true
})
export class SubcourseCreateOrConnectWithoutSubcourse_waiting_list_pupilInput {
  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: false
  })
  where!: SubcourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutSubcourse_waiting_list_pupilInput;
}
