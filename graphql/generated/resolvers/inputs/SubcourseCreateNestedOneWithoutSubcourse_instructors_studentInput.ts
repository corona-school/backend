import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateOrConnectWithoutSubcourse_instructors_studentInput } from "../inputs/SubcourseCreateOrConnectWithoutSubcourse_instructors_studentInput";
import { SubcourseCreateWithoutSubcourse_instructors_studentInput } from "../inputs/SubcourseCreateWithoutSubcourse_instructors_studentInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType("SubcourseCreateNestedOneWithoutSubcourse_instructors_studentInput", {
  isAbstract: true
})
export class SubcourseCreateNestedOneWithoutSubcourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => SubcourseCreateWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  create?: SubcourseCreateWithoutSubcourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateOrConnectWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  connectOrCreate?: SubcourseCreateOrConnectWithoutSubcourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: true
  })
  connect?: SubcourseWhereUniqueInput | undefined;
}
