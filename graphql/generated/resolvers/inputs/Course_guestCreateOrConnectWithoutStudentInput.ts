import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestCreateWithoutStudentInput } from "../inputs/Course_guestCreateWithoutStudentInput";
import { Course_guestWhereUniqueInput } from "../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_guestCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => Course_guestWhereUniqueInput, {
    nullable: false
  })
  where!: Course_guestWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_guestCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Course_guestCreateWithoutStudentInput;
}
