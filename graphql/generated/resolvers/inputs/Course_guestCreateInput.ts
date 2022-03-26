import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateNestedOneWithoutCourse_guestInput } from "../inputs/CourseCreateNestedOneWithoutCourse_guestInput";
import { StudentCreateNestedOneWithoutCourse_guestInput } from "../inputs/StudentCreateNestedOneWithoutCourse_guestInput";

@TypeGraphQL.InputType("Course_guestCreateInput", {
  isAbstract: true
})
export class Course_guestCreateInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  token!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  firstname!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  lastname!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  email!: string;

  @TypeGraphQL.Field(_type => CourseCreateNestedOneWithoutCourse_guestInput, {
    nullable: true
  })
  course?: CourseCreateNestedOneWithoutCourse_guestInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutCourse_guestInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutCourse_guestInput | undefined;
}
