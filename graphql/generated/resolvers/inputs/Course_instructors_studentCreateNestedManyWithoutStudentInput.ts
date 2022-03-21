import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentCreateManyStudentInputEnvelope } from "../inputs/Course_instructors_studentCreateManyStudentInputEnvelope";
import { Course_instructors_studentCreateOrConnectWithoutStudentInput } from "../inputs/Course_instructors_studentCreateOrConnectWithoutStudentInput";
import { Course_instructors_studentCreateWithoutStudentInput } from "../inputs/Course_instructors_studentCreateWithoutStudentInput";
import { Course_instructors_studentWhereUniqueInput } from "../inputs/Course_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType("Course_instructors_studentCreateNestedManyWithoutStudentInput", {
  isAbstract: true
})
export class Course_instructors_studentCreateNestedManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Course_instructors_studentCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Course_instructors_studentCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Course_instructors_studentCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Course_instructors_studentCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_instructors_studentWhereUniqueInput[] | undefined;
}
