import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateManyStudentInputEnvelope } from "../inputs/CourseCreateManyStudentInputEnvelope";
import { CourseCreateOrConnectWithoutStudentInput } from "../inputs/CourseCreateOrConnectWithoutStudentInput";
import { CourseCreateWithoutStudentInput } from "../inputs/CourseCreateWithoutStudentInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseCreateNestedManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [CourseCreateWithoutStudentInput], {
    nullable: true
  })
  create?: CourseCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: CourseCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => CourseCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: CourseCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [CourseWhereUniqueInput], {
    nullable: true
  })
  connect?: CourseWhereUniqueInput[] | undefined;
}
