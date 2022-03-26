import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateManyPupilInputEnvelope } from "../inputs/Course_participation_certificateCreateManyPupilInputEnvelope";
import { Course_participation_certificateCreateOrConnectWithoutPupilInput } from "../inputs/Course_participation_certificateCreateOrConnectWithoutPupilInput";
import { Course_participation_certificateCreateWithoutPupilInput } from "../inputs/Course_participation_certificateCreateWithoutPupilInput";
import { Course_participation_certificateScalarWhereInput } from "../inputs/Course_participation_certificateScalarWhereInput";
import { Course_participation_certificateUpdateManyWithWhereWithoutPupilInput } from "../inputs/Course_participation_certificateUpdateManyWithWhereWithoutPupilInput";
import { Course_participation_certificateUpdateWithWhereUniqueWithoutPupilInput } from "../inputs/Course_participation_certificateUpdateWithWhereUniqueWithoutPupilInput";
import { Course_participation_certificateUpsertWithWhereUniqueWithoutPupilInput } from "../inputs/Course_participation_certificateUpsertWithWhereUniqueWithoutPupilInput";
import { Course_participation_certificateWhereUniqueInput } from "../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Course_participation_certificateUpdateManyWithoutPupilInput", {
  isAbstract: true
})
export class Course_participation_certificateUpdateManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Course_participation_certificateCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Course_participation_certificateCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateUpsertWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  upsert?: Course_participation_certificateUpsertWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Course_participation_certificateCreateManyPupilInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateUpdateWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  update?: Course_participation_certificateUpdateWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateUpdateManyWithWhereWithoutPupilInput], {
    nullable: true
  })
  updateMany?: Course_participation_certificateUpdateManyWithWhereWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_participation_certificateScalarWhereInput[] | undefined;
}
