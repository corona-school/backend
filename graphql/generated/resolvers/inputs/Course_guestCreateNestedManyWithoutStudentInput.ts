import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestCreateManyStudentInputEnvelope } from "../inputs/Course_guestCreateManyStudentInputEnvelope";
import { Course_guestCreateOrConnectWithoutStudentInput } from "../inputs/Course_guestCreateOrConnectWithoutStudentInput";
import { Course_guestCreateWithoutStudentInput } from "../inputs/Course_guestCreateWithoutStudentInput";
import { Course_guestWhereUniqueInput } from "../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.InputType("Course_guestCreateNestedManyWithoutStudentInput", {
  isAbstract: true
})
export class Course_guestCreateNestedManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Course_guestCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Course_guestCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Course_guestCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_guestCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Course_guestCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_guestWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_guestWhereUniqueInput[] | undefined;
}
