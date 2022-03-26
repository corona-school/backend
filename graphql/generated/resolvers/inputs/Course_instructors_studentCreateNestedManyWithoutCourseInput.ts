import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentCreateManyCourseInputEnvelope } from "../inputs/Course_instructors_studentCreateManyCourseInputEnvelope";
import { Course_instructors_studentCreateOrConnectWithoutCourseInput } from "../inputs/Course_instructors_studentCreateOrConnectWithoutCourseInput";
import { Course_instructors_studentCreateWithoutCourseInput } from "../inputs/Course_instructors_studentCreateWithoutCourseInput";
import { Course_instructors_studentWhereUniqueInput } from "../inputs/Course_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentCreateNestedManyWithoutCourseInput {
  @TypeGraphQL.Field(_type => [Course_instructors_studentCreateWithoutCourseInput], {
    nullable: true
  })
  create?: Course_instructors_studentCreateWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentCreateOrConnectWithoutCourseInput], {
    nullable: true
  })
  connectOrCreate?: Course_instructors_studentCreateOrConnectWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentCreateManyCourseInputEnvelope, {
    nullable: true
  })
  createMany?: Course_instructors_studentCreateManyCourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_instructors_studentWhereUniqueInput[] | undefined;
}
