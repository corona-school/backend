import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentCreateManyStudentInputEnvelope } from "../inputs/Subcourse_instructors_studentCreateManyStudentInputEnvelope";
import { Subcourse_instructors_studentCreateOrConnectWithoutStudentInput } from "../inputs/Subcourse_instructors_studentCreateOrConnectWithoutStudentInput";
import { Subcourse_instructors_studentCreateWithoutStudentInput } from "../inputs/Subcourse_instructors_studentCreateWithoutStudentInput";
import { Subcourse_instructors_studentScalarWhereInput } from "../inputs/Subcourse_instructors_studentScalarWhereInput";
import { Subcourse_instructors_studentUpdateManyWithWhereWithoutStudentInput } from "../inputs/Subcourse_instructors_studentUpdateManyWithWhereWithoutStudentInput";
import { Subcourse_instructors_studentUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/Subcourse_instructors_studentUpdateWithWhereUniqueWithoutStudentInput";
import { Subcourse_instructors_studentUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/Subcourse_instructors_studentUpsertWithWhereUniqueWithoutStudentInput";
import { Subcourse_instructors_studentWhereUniqueInput } from "../inputs/Subcourse_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType("Subcourse_instructors_studentUpdateManyWithoutStudentInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Subcourse_instructors_studentCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_instructors_studentCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: Subcourse_instructors_studentUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_instructors_studentCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  set?: Subcourse_instructors_studentWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Subcourse_instructors_studentWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  delete?: Subcourse_instructors_studentWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_instructors_studentWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: Subcourse_instructors_studentUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: Subcourse_instructors_studentUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Subcourse_instructors_studentScalarWhereInput[] | undefined;
}
