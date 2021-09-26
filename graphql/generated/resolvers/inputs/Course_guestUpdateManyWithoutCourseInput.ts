import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestCreateManyCourseInputEnvelope } from "../inputs/Course_guestCreateManyCourseInputEnvelope";
import { Course_guestCreateOrConnectWithoutCourseInput } from "../inputs/Course_guestCreateOrConnectWithoutCourseInput";
import { Course_guestCreateWithoutCourseInput } from "../inputs/Course_guestCreateWithoutCourseInput";
import { Course_guestScalarWhereInput } from "../inputs/Course_guestScalarWhereInput";
import { Course_guestUpdateManyWithWhereWithoutCourseInput } from "../inputs/Course_guestUpdateManyWithWhereWithoutCourseInput";
import { Course_guestUpdateWithWhereUniqueWithoutCourseInput } from "../inputs/Course_guestUpdateWithWhereUniqueWithoutCourseInput";
import { Course_guestUpsertWithWhereUniqueWithoutCourseInput } from "../inputs/Course_guestUpsertWithWhereUniqueWithoutCourseInput";
import { Course_guestWhereUniqueInput } from "../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_guestUpdateManyWithoutCourseInput {
  @TypeGraphQL.Field(_type => [Course_guestCreateWithoutCourseInput], {
    nullable: true
  })
  create?: Course_guestCreateWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestCreateOrConnectWithoutCourseInput], {
    nullable: true
  })
  connectOrCreate?: Course_guestCreateOrConnectWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestUpsertWithWhereUniqueWithoutCourseInput], {
    nullable: true
  })
  upsert?: Course_guestUpsertWithWhereUniqueWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_guestCreateManyCourseInputEnvelope, {
    nullable: true
  })
  createMany?: Course_guestCreateManyCourseInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [Course_guestUpdateWithWhereUniqueWithoutCourseInput], {
    nullable: true
  })
  update?: Course_guestUpdateWithWhereUniqueWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestUpdateManyWithWhereWithoutCourseInput], {
    nullable: true
  })
  updateMany?: Course_guestUpdateManyWithWhereWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_guestScalarWhereInput[] | undefined;
}
