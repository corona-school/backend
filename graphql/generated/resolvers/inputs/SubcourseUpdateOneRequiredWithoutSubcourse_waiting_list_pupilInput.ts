import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateOrConnectWithoutSubcourse_waiting_list_pupilInput } from "../inputs/SubcourseCreateOrConnectWithoutSubcourse_waiting_list_pupilInput";
import { SubcourseCreateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/SubcourseCreateWithoutSubcourse_waiting_list_pupilInput";
import { SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput";
import { SubcourseUpsertWithoutSubcourse_waiting_list_pupilInput } from "../inputs/SubcourseUpsertWithoutSubcourse_waiting_list_pupilInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType("SubcourseUpdateOneRequiredWithoutSubcourse_waiting_list_pupilInput", {
  isAbstract: true
})
export class SubcourseUpdateOneRequiredWithoutSubcourse_waiting_list_pupilInput {
  @TypeGraphQL.Field(_type => SubcourseCreateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  create?: SubcourseCreateWithoutSubcourse_waiting_list_pupilInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateOrConnectWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  connectOrCreate?: SubcourseCreateOrConnectWithoutSubcourse_waiting_list_pupilInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpsertWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  upsert?: SubcourseUpsertWithoutSubcourse_waiting_list_pupilInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: true
  })
  connect?: SubcourseWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  update?: SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput | undefined;
}
