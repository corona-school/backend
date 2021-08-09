import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateManyStudentInputEnvelope } from "../inputs/Course_participation_certificateCreateManyStudentInputEnvelope";
import { Course_participation_certificateCreateOrConnectWithoutStudentInput } from "../inputs/Course_participation_certificateCreateOrConnectWithoutStudentInput";
import { Course_participation_certificateCreateWithoutStudentInput } from "../inputs/Course_participation_certificateCreateWithoutStudentInput";
import { Course_participation_certificateWhereUniqueInput } from "../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_participation_certificateCreateNestedManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Course_participation_certificateCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Course_participation_certificateCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Course_participation_certificateCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_participation_certificateWhereUniqueInput[] | undefined;
}
