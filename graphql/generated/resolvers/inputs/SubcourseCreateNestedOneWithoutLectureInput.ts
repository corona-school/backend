import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateOrConnectWithoutLectureInput } from "../inputs/SubcourseCreateOrConnectWithoutLectureInput";
import { SubcourseCreateWithoutLectureInput } from "../inputs/SubcourseCreateWithoutLectureInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseCreateNestedOneWithoutLectureInput {
  @TypeGraphQL.Field(_type => SubcourseCreateWithoutLectureInput, {
    nullable: true
  })
  create?: SubcourseCreateWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateOrConnectWithoutLectureInput, {
    nullable: true
  })
  connectOrCreate?: SubcourseCreateOrConnectWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: true
  })
  connect?: SubcourseWhereUniqueInput | undefined;
}
