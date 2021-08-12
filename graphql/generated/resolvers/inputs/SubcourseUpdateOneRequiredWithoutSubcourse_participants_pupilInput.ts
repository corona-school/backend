import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateOrConnectWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseCreateOrConnectWithoutSubcourse_participants_pupilInput";
import { SubcourseCreateWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseCreateWithoutSubcourse_participants_pupilInput";
import { SubcourseUpdateWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseUpdateWithoutSubcourse_participants_pupilInput";
import { SubcourseUpsertWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseUpsertWithoutSubcourse_participants_pupilInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseUpdateOneRequiredWithoutSubcourse_participants_pupilInput {
  @TypeGraphQL.Field(_type => SubcourseCreateWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  create?: SubcourseCreateWithoutSubcourse_participants_pupilInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateOrConnectWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  connectOrCreate?: SubcourseCreateOrConnectWithoutSubcourse_participants_pupilInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpsertWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  upsert?: SubcourseUpsertWithoutSubcourse_participants_pupilInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: true
  })
  connect?: SubcourseWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  update?: SubcourseUpdateWithoutSubcourse_participants_pupilInput | undefined;
}
