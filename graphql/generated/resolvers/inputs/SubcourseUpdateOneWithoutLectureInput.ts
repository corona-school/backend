import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateOrConnectWithoutLectureInput } from "../inputs/SubcourseCreateOrConnectWithoutLectureInput";
import { SubcourseCreateWithoutLectureInput } from "../inputs/SubcourseCreateWithoutLectureInput";
import { SubcourseUpdateWithoutLectureInput } from "../inputs/SubcourseUpdateWithoutLectureInput";
import { SubcourseUpsertWithoutLectureInput } from "../inputs/SubcourseUpsertWithoutLectureInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseUpdateOneWithoutLectureInput {
  @TypeGraphQL.Field(_type => SubcourseCreateWithoutLectureInput, {
    nullable: true
  })
  create?: SubcourseCreateWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateOrConnectWithoutLectureInput, {
    nullable: true
  })
  connectOrCreate?: SubcourseCreateOrConnectWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpsertWithoutLectureInput, {
    nullable: true
  })
  upsert?: SubcourseUpsertWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: true
  })
  connect?: SubcourseWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateWithoutLectureInput, {
    nullable: true
  })
  update?: SubcourseUpdateWithoutLectureInput | undefined;
}
