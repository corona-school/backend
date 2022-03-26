import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope } from "../inputs/Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope";
import { Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilCreateWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilCreateWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilScalarWhereInput } from "../inputs/Subcourse_waiting_list_pupilScalarWhereInput";
import { Subcourse_waiting_list_pupilUpdateManyWithWhereWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilUpdateManyWithWhereWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilUpsertWithWhereUniqueWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilUpsertWithWhereUniqueWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilUpdateManyWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateWithoutSubcourseInput], {
    nullable: true
  })
  create?: Subcourse_waiting_list_pupilCreateWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilUpsertWithWhereUniqueWithoutSubcourseInput], {
    nullable: true
  })
  upsert?: Subcourse_waiting_list_pupilUpsertWithWhereUniqueWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  set?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  delete?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutSubcourseInput], {
    nullable: true
  })
  update?: Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilUpdateManyWithWhereWithoutSubcourseInput], {
    nullable: true
  })
  updateMany?: Subcourse_waiting_list_pupilUpdateManyWithWhereWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Subcourse_waiting_list_pupilScalarWhereInput[] | undefined;
}
