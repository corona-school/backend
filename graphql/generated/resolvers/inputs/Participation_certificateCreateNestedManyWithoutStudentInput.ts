import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateCreateManyStudentInputEnvelope } from "../inputs/Participation_certificateCreateManyStudentInputEnvelope";
import { Participation_certificateCreateOrConnectWithoutStudentInput } from "../inputs/Participation_certificateCreateOrConnectWithoutStudentInput";
import { Participation_certificateCreateWithoutStudentInput } from "../inputs/Participation_certificateCreateWithoutStudentInput";
import { Participation_certificateWhereUniqueInput } from "../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Participation_certificateCreateNestedManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Participation_certificateCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Participation_certificateCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Participation_certificateCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Participation_certificateCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateWhereUniqueInput], {
    nullable: true
  })
  connect?: Participation_certificateWhereUniqueInput[] | undefined;
}
