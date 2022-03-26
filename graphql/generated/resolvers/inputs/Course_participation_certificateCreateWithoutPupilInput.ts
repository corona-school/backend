import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutCourse_participation_certificateInput } from "../inputs/StudentCreateNestedOneWithoutCourse_participation_certificateInput";
import { SubcourseCreateNestedOneWithoutCourse_participation_certificateInput } from "../inputs/SubcourseCreateNestedOneWithoutCourse_participation_certificateInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_participation_certificateCreateWithoutPupilInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateNestedOneWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  subcourse?: SubcourseCreateNestedOneWithoutCourse_participation_certificateInput | undefined;
}
