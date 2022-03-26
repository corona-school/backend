import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestCreateManyCourseInputEnvelope } from "../inputs/Course_guestCreateManyCourseInputEnvelope";
import { Course_guestCreateOrConnectWithoutCourseInput } from "../inputs/Course_guestCreateOrConnectWithoutCourseInput";
import { Course_guestCreateWithoutCourseInput } from "../inputs/Course_guestCreateWithoutCourseInput";
import { Course_guestWhereUniqueInput } from "../inputs/Course_guestWhereUniqueInput";

@TypeGraphQL.InputType("Course_guestCreateNestedManyWithoutCourseInput", {
  isAbstract: true
})
export class Course_guestCreateNestedManyWithoutCourseInput {
  @TypeGraphQL.Field(_type => [Course_guestCreateWithoutCourseInput], {
    nullable: true
  })
  create?: Course_guestCreateWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestCreateOrConnectWithoutCourseInput], {
    nullable: true
  })
  connectOrCreate?: Course_guestCreateOrConnectWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_guestCreateManyCourseInputEnvelope, {
    nullable: true
  })
  createMany?: Course_guestCreateManyCourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_guestWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_guestWhereUniqueInput[] | undefined;
}
