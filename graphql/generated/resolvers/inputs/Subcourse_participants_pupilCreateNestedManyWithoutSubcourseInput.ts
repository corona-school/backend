import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilCreateManySubcourseInputEnvelope } from "../inputs/Subcourse_participants_pupilCreateManySubcourseInputEnvelope";
import { Subcourse_participants_pupilCreateOrConnectWithoutSubcourseInput } from "../inputs/Subcourse_participants_pupilCreateOrConnectWithoutSubcourseInput";
import { Subcourse_participants_pupilCreateWithoutSubcourseInput } from "../inputs/Subcourse_participants_pupilCreateWithoutSubcourseInput";
import { Subcourse_participants_pupilWhereUniqueInput } from "../inputs/Subcourse_participants_pupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_participants_pupilCreateNestedManyWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilCreateWithoutSubcourseInput], {
    nullable: true
  })
  create?: Subcourse_participants_pupilCreateWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilCreateOrConnectWithoutSubcourseInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_participants_pupilCreateOrConnectWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilCreateManySubcourseInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_participants_pupilCreateManySubcourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_participants_pupilWhereUniqueInput[] | undefined;
}
