import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateManyStudentInputEnvelope } from "../inputs/Course_participation_certificateCreateManyStudentInputEnvelope";
import { Course_participation_certificateCreateOrConnectWithoutStudentInput } from "../inputs/Course_participation_certificateCreateOrConnectWithoutStudentInput";
import { Course_participation_certificateCreateWithoutStudentInput } from "../inputs/Course_participation_certificateCreateWithoutStudentInput";
import { Course_participation_certificateScalarWhereInput } from "../inputs/Course_participation_certificateScalarWhereInput";
import { Course_participation_certificateUpdateManyWithWhereWithoutStudentInput } from "../inputs/Course_participation_certificateUpdateManyWithWhereWithoutStudentInput";
import { Course_participation_certificateUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/Course_participation_certificateUpdateWithWhereUniqueWithoutStudentInput";
import { Course_participation_certificateUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/Course_participation_certificateUpsertWithWhereUniqueWithoutStudentInput";
import { Course_participation_certificateWhereUniqueInput } from "../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_participation_certificateUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Course_participation_certificateCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Course_participation_certificateCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: Course_participation_certificateUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Course_participation_certificateCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereUniqueInput], {
    nullable: true
  })
  set?: Course_participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Course_participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereUniqueInput], {
    nullable: true
  })
  delete?: Course_participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: Course_participation_certificateUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: Course_participation_certificateUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_participation_certificateScalarWhereInput[] | undefined;
}
