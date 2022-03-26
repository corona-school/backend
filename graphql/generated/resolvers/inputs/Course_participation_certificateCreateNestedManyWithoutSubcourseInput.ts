import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateManySubcourseInputEnvelope } from "../inputs/Course_participation_certificateCreateManySubcourseInputEnvelope";
import { Course_participation_certificateCreateOrConnectWithoutSubcourseInput } from "../inputs/Course_participation_certificateCreateOrConnectWithoutSubcourseInput";
import { Course_participation_certificateCreateWithoutSubcourseInput } from "../inputs/Course_participation_certificateCreateWithoutSubcourseInput";
import { Course_participation_certificateWhereUniqueInput } from "../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Course_participation_certificateCreateNestedManyWithoutSubcourseInput", {
  isAbstract: true
})
export class Course_participation_certificateCreateNestedManyWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateWithoutSubcourseInput], {
    nullable: true
  })
  create?: Course_participation_certificateCreateWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateOrConnectWithoutSubcourseInput], {
    nullable: true
  })
  connectOrCreate?: Course_participation_certificateCreateOrConnectWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateCreateManySubcourseInputEnvelope, {
    nullable: true
  })
  createMany?: Course_participation_certificateCreateManySubcourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_participation_certificateWhereUniqueInput[] | undefined;
}
