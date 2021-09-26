import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateManySubcourseInputEnvelope } from "../inputs/Course_participation_certificateCreateManySubcourseInputEnvelope";
import { Course_participation_certificateCreateOrConnectWithoutSubcourseInput } from "../inputs/Course_participation_certificateCreateOrConnectWithoutSubcourseInput";
import { Course_participation_certificateCreateWithoutSubcourseInput } from "../inputs/Course_participation_certificateCreateWithoutSubcourseInput";
import { Course_participation_certificateScalarWhereInput } from "../inputs/Course_participation_certificateScalarWhereInput";
import { Course_participation_certificateUpdateManyWithWhereWithoutSubcourseInput } from "../inputs/Course_participation_certificateUpdateManyWithWhereWithoutSubcourseInput";
import { Course_participation_certificateUpdateWithWhereUniqueWithoutSubcourseInput } from "../inputs/Course_participation_certificateUpdateWithWhereUniqueWithoutSubcourseInput";
import { Course_participation_certificateUpsertWithWhereUniqueWithoutSubcourseInput } from "../inputs/Course_participation_certificateUpsertWithWhereUniqueWithoutSubcourseInput";
import { Course_participation_certificateWhereUniqueInput } from "../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_participation_certificateUpdateManyWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateWithoutSubcourseInput], {
    nullable: true
  })
  create?: Course_participation_certificateCreateWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateOrConnectWithoutSubcourseInput], {
    nullable: true
  })
  connectOrCreate?: Course_participation_certificateCreateOrConnectWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateUpsertWithWhereUniqueWithoutSubcourseInput], {
    nullable: true
  })
  upsert?: Course_participation_certificateUpsertWithWhereUniqueWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateCreateManySubcourseInputEnvelope, {
    nullable: true
  })
  createMany?: Course_participation_certificateCreateManySubcourseInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [Course_participation_certificateUpdateWithWhereUniqueWithoutSubcourseInput], {
    nullable: true
  })
  update?: Course_participation_certificateUpdateWithWhereUniqueWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateUpdateManyWithWhereWithoutSubcourseInput], {
    nullable: true
  })
  updateMany?: Course_participation_certificateUpdateManyWithWhereWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_participation_certificateScalarWhereInput[] | undefined;
}
