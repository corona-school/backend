import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentCreateManyStudentInputEnvelope } from "../inputs/Subcourse_instructors_studentCreateManyStudentInputEnvelope";
import { Subcourse_instructors_studentCreateOrConnectWithoutStudentInput } from "../inputs/Subcourse_instructors_studentCreateOrConnectWithoutStudentInput";
import { Subcourse_instructors_studentCreateWithoutStudentInput } from "../inputs/Subcourse_instructors_studentCreateWithoutStudentInput";
import { Subcourse_instructors_studentWhereUniqueInput } from "../inputs/Subcourse_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentCreateNestedManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Subcourse_instructors_studentCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_instructors_studentCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_instructors_studentCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_instructors_studentWhereUniqueInput[] | undefined;
}
