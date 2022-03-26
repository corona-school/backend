import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentCreateManyStudentInputEnvelope } from "../inputs/Course_instructors_studentCreateManyStudentInputEnvelope";
import { Course_instructors_studentCreateOrConnectWithoutStudentInput } from "../inputs/Course_instructors_studentCreateOrConnectWithoutStudentInput";
import { Course_instructors_studentCreateWithoutStudentInput } from "../inputs/Course_instructors_studentCreateWithoutStudentInput";
import { Course_instructors_studentScalarWhereInput } from "../inputs/Course_instructors_studentScalarWhereInput";
import { Course_instructors_studentUpdateManyWithWhereWithoutStudentInput } from "../inputs/Course_instructors_studentUpdateManyWithWhereWithoutStudentInput";
import { Course_instructors_studentUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/Course_instructors_studentUpdateWithWhereUniqueWithoutStudentInput";
import { Course_instructors_studentUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/Course_instructors_studentUpsertWithWhereUniqueWithoutStudentInput";
import { Course_instructors_studentWhereUniqueInput } from "../inputs/Course_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Course_instructors_studentCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Course_instructors_studentCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Course_instructors_studentCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: Course_instructors_studentUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Course_instructors_studentCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_instructors_studentWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  set?: Course_instructors_studentWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Course_instructors_studentWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  delete?: Course_instructors_studentWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: Course_instructors_studentUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: Course_instructors_studentUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_instructors_studentScalarWhereInput[] | undefined;
}
