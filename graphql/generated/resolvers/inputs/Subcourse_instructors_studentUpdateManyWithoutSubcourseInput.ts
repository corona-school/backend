import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentCreateManySubcourseInputEnvelope } from "../inputs/Subcourse_instructors_studentCreateManySubcourseInputEnvelope";
import { Subcourse_instructors_studentCreateOrConnectWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentCreateOrConnectWithoutSubcourseInput";
import { Subcourse_instructors_studentCreateWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentCreateWithoutSubcourseInput";
import { Subcourse_instructors_studentScalarWhereInput } from "../inputs/Subcourse_instructors_studentScalarWhereInput";
import { Subcourse_instructors_studentUpdateManyWithWhereWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentUpdateManyWithWhereWithoutSubcourseInput";
import { Subcourse_instructors_studentUpdateWithWhereUniqueWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentUpdateWithWhereUniqueWithoutSubcourseInput";
import { Subcourse_instructors_studentUpsertWithWhereUniqueWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentUpsertWithWhereUniqueWithoutSubcourseInput";
import { Subcourse_instructors_studentWhereUniqueInput } from "../inputs/Subcourse_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType("Subcourse_instructors_studentUpdateManyWithoutSubcourseInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentUpdateManyWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateWithoutSubcourseInput], {
    nullable: true
  })
  create?: Subcourse_instructors_studentCreateWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateOrConnectWithoutSubcourseInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_instructors_studentCreateOrConnectWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentUpsertWithWhereUniqueWithoutSubcourseInput], {
    nullable: true
  })
  upsert?: Subcourse_instructors_studentUpsertWithWhereUniqueWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCreateManySubcourseInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_instructors_studentCreateManySubcourseInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentUpdateWithWhereUniqueWithoutSubcourseInput], {
    nullable: true
  })
  update?: Subcourse_instructors_studentUpdateWithWhereUniqueWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentUpdateManyWithWhereWithoutSubcourseInput], {
    nullable: true
  })
  updateMany?: Subcourse_instructors_studentUpdateManyWithWhereWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Subcourse_instructors_studentScalarWhereInput[] | undefined;
}
