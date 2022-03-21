import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateOrConnectWithoutCourse_participation_certificateInput } from "../inputs/SubcourseCreateOrConnectWithoutCourse_participation_certificateInput";
import { SubcourseCreateWithoutCourse_participation_certificateInput } from "../inputs/SubcourseCreateWithoutCourse_participation_certificateInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType("SubcourseCreateNestedOneWithoutCourse_participation_certificateInput", {
  isAbstract: true
})
export class SubcourseCreateNestedOneWithoutCourse_participation_certificateInput {
  @TypeGraphQL.Field(_type => SubcourseCreateWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  create?: SubcourseCreateWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateOrConnectWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  connectOrCreate?: SubcourseCreateOrConnectWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: true
  })
  connect?: SubcourseWhereUniqueInput | undefined;
}
