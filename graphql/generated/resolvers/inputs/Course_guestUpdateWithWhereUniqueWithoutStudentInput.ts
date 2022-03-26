import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestUpdateWithoutStudentInput } from "../inputs/Course_guestUpdateWithoutStudentInput";
import { Course_guestWhereUniqueInput } from "../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_guestUpdateWithWhereUniqueWithoutStudentInput {
  @TypeGraphQL.Field(_type => Course_guestWhereUniqueInput, {
    nullable: false
  })
  where!: Course_guestWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_guestUpdateWithoutStudentInput, {
    nullable: false
  })
  data!: Course_guestUpdateWithoutStudentInput;
}
