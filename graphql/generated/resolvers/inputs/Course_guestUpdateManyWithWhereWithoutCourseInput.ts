import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestScalarWhereInput } from "../inputs/Course_guestScalarWhereInput";
import { Course_guestUpdateManyMutationInput } from "../inputs/Course_guestUpdateManyMutationInput";

@TypeGraphQL.InputType("Course_guestUpdateManyWithWhereWithoutCourseInput", {
  isAbstract: true
})
export class Course_guestUpdateManyWithWhereWithoutCourseInput {
  @TypeGraphQL.Field(_type => Course_guestScalarWhereInput, {
    nullable: false
  })
  where!: Course_guestScalarWhereInput;

  @TypeGraphQL.Field(_type => Course_guestUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_guestUpdateManyMutationInput;
}
