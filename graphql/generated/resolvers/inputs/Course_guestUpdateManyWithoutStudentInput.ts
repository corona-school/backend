import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestCreateManyStudentInputEnvelope } from "../inputs/Course_guestCreateManyStudentInputEnvelope";
import { Course_guestCreateOrConnectWithoutStudentInput } from "../inputs/Course_guestCreateOrConnectWithoutStudentInput";
import { Course_guestCreateWithoutStudentInput } from "../inputs/Course_guestCreateWithoutStudentInput";
import { Course_guestScalarWhereInput } from "../inputs/Course_guestScalarWhereInput";
import { Course_guestUpdateManyWithWhereWithoutStudentInput } from "../inputs/Course_guestUpdateManyWithWhereWithoutStudentInput";
import { Course_guestUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/Course_guestUpdateWithWhereUniqueWithoutStudentInput";
import { Course_guestUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/Course_guestUpsertWithWhereUniqueWithoutStudentInput";
import { Course_guestWhereUniqueInput } from "../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_guestUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Course_guestCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Course_guestCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Course_guestCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: Course_guestUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_guestCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Course_guestCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_guestWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_guestWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestWhereUniqueInput], {
    nullable: true
  })
  set?: Course_guestWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Course_guestWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestWhereUniqueInput], {
    nullable: true
  })
  delete?: Course_guestWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: Course_guestUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: Course_guestUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_guestScalarWhereInput[] | undefined;
}
