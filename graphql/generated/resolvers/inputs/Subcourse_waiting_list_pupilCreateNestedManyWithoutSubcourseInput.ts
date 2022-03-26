import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope } from "../inputs/Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope";
import { Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilCreateWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilCreateWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilCreateNestedManyWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateWithoutSubcourseInput], {
    nullable: true
  })
  create?: Subcourse_waiting_list_pupilCreateWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_waiting_list_pupilCreateOrConnectWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;
}
