import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateManySubcourseInputEnvelope } from "../inputs/LectureCreateManySubcourseInputEnvelope";
import { LectureCreateOrConnectWithoutSubcourseInput } from "../inputs/LectureCreateOrConnectWithoutSubcourseInput";
import { LectureCreateWithoutSubcourseInput } from "../inputs/LectureCreateWithoutSubcourseInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType("LectureCreateNestedManyWithoutSubcourseInput", {
  isAbstract: true
})
export class LectureCreateNestedManyWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => [LectureCreateWithoutSubcourseInput], {
    nullable: true
  })
  create?: LectureCreateWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureCreateOrConnectWithoutSubcourseInput], {
    nullable: true
  })
  connectOrCreate?: LectureCreateOrConnectWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => LectureCreateManySubcourseInputEnvelope, {
    nullable: true
  })
  createMany?: LectureCreateManySubcourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [LectureWhereUniqueInput], {
    nullable: true
  })
  connect?: LectureWhereUniqueInput[] | undefined;
}
